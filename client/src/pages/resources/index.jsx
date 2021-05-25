import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import { useRouter } from 'next/router';
import api from 'api';
import fuzzysort from 'fuzzysort';

import throttle from 'lodash/throttle';
import omit from 'lodash/omit';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/lazy';

import Exclamation from '../../../public/icons/exclamation.svg';

import classNames from 'classnames/bind';
import styles from './ResourceSearch.module.scss';
const cx = classNames.bind(styles);


function filterResources(passedResources, filters) {
  let resources = passedResources;
  // Text search
  if (filters.search) {
    const results = fuzzysort.go(
      filters.search,
      resources,
      { keys: ['name', 'organization'] },
    );
    resources = results.map((result) => result.obj);
  }
  // Other filters
  resources = resources.filter((r) => {
    // Category filter
    if (filters.categories && filters.categories.length) {
      return filters.categories.includes(r.category);
    }
    // TODO: more filters when implemented
    return true;
  });

  return resources;
}

// Latitude/longitude filters happen in a separate step so that the map can display everything
const geoFilterResources = (
  resources,
  { min_lat: minLat, max_lat: maxLat, min_lng: minLng, max_lng: maxLng },
) => resources.filter(({ location }) => {
  if ((minLat || maxLat || minLng || maxLng) && !location) return false;
  const { latitude: resourceLat, longitude: resourceLng } = location || {};
  if (minLat && (resourceLat < minLat)) return false;
  if (maxLat && (resourceLat > maxLat)) return false;
  if (minLng && (resourceLng < minLng)) return false;
  if (maxLng && (resourceLng > maxLng)) return false;
  return true;
});


export default function ResourcesPage({ data: resources }) {
  const routerRef = useRef();
  const router = useRouter();
  const mapRef = useRef();
  routerRef.current = router;

  const filteredResourcesRef = useRef();
  const filteredResources = filterResources(resources, router.query);
  filteredResourcesRef.current = filteredResources;
  const visibleResources = geoFilterResources(filteredResources, router.query);

  const setQueryParams = useCallback((params) => {
    const oldQuery = omit(routerRef.current.query, Object.keys(params));
    routerRef.current.replace({
      path: '/resources',
      query: {
        ...oldQuery,
        // Exclude completely keys that are set to undefined
        ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v !== 'undefined')),
      },
    }, undefined, { shallow: true });
  }, []);

  const onMapMove = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
    throttle(
      ({ minLat, maxLat, minLng, maxLng }) => {
        const newQuery = {
          min_lat: minLat.toFixed(5),
          max_lat: maxLat.toFixed(5),
          min_lng: minLng.toFixed(5),
          max_lng: maxLng.toFixed(5),
        };
        // If the filter makes a difference, apply it
        const currentResourceSet = filteredResourcesRef.current;
        const resourcesWithLoc = currentResourceSet.filter((r) => r.location);
        if (geoFilterResources(currentResourceSet, newQuery).length < resourcesWithLoc.length) {
          setQueryParams(newQuery);
        // Once the filter makes no difference, remove it
        } else {
          setQueryParams(Object.fromEntries(Object.entries(newQuery).map(([k]) => [k, undefined])));
        }
      },
      50,
    ),
    [],
  );

  const [filters, setFilters] = useState({
    categories: router.query.categories ? router.query.categories.split(',') : [],
    daysOfWeek: [],
    startTime: {
      hour: '',
      min: '',
      timePeriod: '',
    },
    endTime: {
      hour: '',
      min: '',
      timePeriod: '',
    },
    startDate: {
      month: '',
      day: '',
      year: '',
    },
    endDate: {
      month: '',
      day: '',
      year: '',
    },
  });

  useEffect(() => {
    const joined = filters.categories.join(',');
    setQueryParams({ categories: joined.length ? joined : undefined });
  }, [filters.categories, setQueryParams]);

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter
          values={filters}
          onChange={setFilters}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map
            resources={filteredResources}
            onMove={onMapMove}
            ref={mapRef}
          />
        </div>
        <div className={cx('results-summary', { empty: !visibleResources.length })}>
          <div className={cx('message')}>
            {visibleResources.length ? visibleResources.length : 'No'}
            {' resource'}
            {visibleResources.length === 1 ? ' ' : 's '}
            found
          </div>
          <button
            type="button"
            className={cx('clear')}
            onClick={() => {
              mapRef.current.resetBounds();
              router.replace('/resources', undefined, { shallow: true });
            }}
          >
            Clear filters
          </button>
        </div>
        {visibleResources?.length > 0
          ? visibleResources.map((r) => <ResourceCard key={r.id} {...r} />)
          : (
            <div className={styles.noResults}>
              <Exclamation className={styles.exclamation} />
              <h4>No results found.</h4>
              <div>We cannot find any matching resources.</div>
            </div>
          )}
      </div>
    </div>
  );
}
ResourcesPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(RESOURCE_PROP_TYPES)).isRequired,
};

export async function getServerSideProps() {
  return {
    props: { data: await api.get('/resources') },
  };
}
