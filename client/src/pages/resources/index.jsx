import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import { useRouter } from 'next/router';
import unauthenticatedApi, { useApi } from 'api';
import fuzzysort from 'fuzzysort';

import throttle from 'lodash/throttle';
import omit from 'lodash/omit';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/lazy';

import Exclamation from '../../../public/icons/exclamation.svg';
import Arrow from '../../../public/icons/arrow.svg';

import classNames from 'classnames/bind';
import styles from './ResourceSearch.module.scss';
import Circleplus from '../../../public/icons/circle_plus.svg';
import { isAdmin } from 'auth';
import AddResourceModal from 'components/AddResourceModal';

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


export default function ResourcesPage({ blocked, data: passedResources }) {
  const [resources, setResources] = useState(passedResources);
  const routerRef = useRef();
  const router = useRouter();
  const mapRef = useRef();
  const api = useApi();

  routerRef.current = router;

  const filteredResourcesRef = useRef();
  const filteredResources = filterResources(resources, router.query);
  filteredResourcesRef.current = filteredResources;
  const visibleResources = geoFilterResources(filteredResources, router.query);
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [openAddResourceModal, setopenAddResourceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const refreshData = () => {
    api.get('resources').then(setResources);
  };

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
  // sends request to create a resource based on resource passed from form
  const addResource = async (resource) => {
    try {
      await api.post('resources', undefined, resource);
      console.log(resources);
      setErrorMessage(null);
      refreshData();
      return true;
    } catch (errors) {
      console.log('status code: ', errors.status);
      if (errors.status === 400 && errors.body) {
        console.log('errors: ', errors.body);
        console.log('errors type: ', typeof errors.body);
        setErrorMessage(JSON.stringify(errors.body));
      }
      return false;
    }
  };

  return (

    <div className={styles.base}>
      <AddResourceModal
        open={openAddResourceModal}
        close={setopenAddResourceModal}
        errorMessage={errorMessage}
        submit={addResource}
      />
      <div className={styles.left}>
        <SidebarFilter
          values={router.query.categories ? router.query.categories.split(',') : []}
          onChange={(cats) => {
            const joined = cats.join(',');
            setQueryParams({ categories: joined.length ? joined : undefined });
          }}
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
          {
          // If user is logged in as an admin, show the add resource button
          !blocked && (
            <div className={cx('buttonContainer')}>
              <button className={cx('addResource')} type="button" onClick={() => setopenAddResourceModal(true)}>
                <Circleplus className={cx('circleIcon')} />
                <div
                  className={cx('addResourceButton')}
                >
                  Add Resource
                </div>
              </button>
            </div>
          )
          }
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

        <div className={cx('dropDownFilter')}>
          <button type="button" className={cx('dropDownFilterButton')} onClick={() => { setDropDownToggle(!dropDownToggle); }}>
            Filters
            <Arrow className={cx({ 'arrow-show': dropDownToggle, 'arrow-hidden': !dropDownToggle })} />
          </button>
          {dropDownToggle ? (
            <div className={cx('dropDownFilterCategories')}>
              <SidebarFilter
                values={router.query.categories ? router.query.categories.split(',') : []}
                onChange={(cats) => {
                  const joined = cats.join(',');
                  setQueryParams({ categories: joined.length ? joined : undefined });
                }}
              />
            </div>
          ) : null}

        </div>

        {/* {visibleResources?.length > 0
          ? visibleResources.map((r) => <ResourceCard key={r.id} {...r} />) */}
        {visibleResources?.length > 0
          // Fill in each resource card
          ? visibleResources.map((r) => (
            <ResourceCard
              key={r.id}
              r={r}
              blocked={blocked}
              onResourceDeleted={refreshData}
              onResourceEdited={refreshData}
            />
          ))
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
  blocked: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(RESOURCE_PROP_TYPES)).isRequired,
};

export async function getServerSideProps(ctx) {
  const blocked = !isAdmin(ctx);
  return {
    props: { blocked, data: await unauthenticatedApi.get('resources') },
  };
}
