import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import { useRouter } from 'next/router';
import api from 'api';
import Fuse from 'fuse.js';

import throttle from 'lodash.throttle';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/Map';


import styles from './ResourceSearch.module.scss';

function filterResources(passedResources, filters) {
  let resources = passedResources;
  if (filters.search) {
    const fuse = new Fuse(resources, { keys: ['name', 'organization', 'category'] });
    resources = fuse.search(filters.search).map((result) => result.item);
  }

  return resources;
}

// Latitude/longitude filters happen in a separate step so that the map can display everything
const geoFilterResources = (
  resources,
  { min_lat: minLat, max_lat: maxLat, min_lng: minLng, max_lng: maxLng },
) => resources.filter(({ location: { latitude: resourceLat, longitude: resourceLng } = {} }) => {
  if (minLat && resourceLat < minLat) return false;
  if (maxLat && resourceLat > maxLat) return false;
  if (minLng && resourceLng < minLng) return false;
  if (maxLng && resourceLng > maxLng) return false;
  return true;
});

export default function ResourcesPage({ data: resources }) {
  const [values, setValues] = useState([]);

  const routerRef = useRef();
  const router = useRouter();
  routerRef.current = router;

  const filteredResourcesRef = useRef();
  const filteredResources = filterResources(resources, router.query);
  filteredResourcesRef.current = filteredResources;
  const visibleResources = geoFilterResources(filteredResources, router.query);

  const onMapMove = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
    throttle(
      ({ minLat, maxLat, minLng, maxLng }) => {
        const newQuery = {
          ...routerRef.current.query,
          min_lat: minLat.toFixed(5),
          max_lat: maxLat.toFixed(5),
          min_lng: minLng.toFixed(5),
          max_lng: maxLng.toFixed(5),
        };
        // If the filter makes a difference, apply it
        const currentResourceSet = filteredResourcesRef.current;
        if (geoFilterResources(currentResourceSet, newQuery).length < currentResourceSet.length) {
          routerRef.current.replace({ path: '/resources', query: newQuery }, undefined, { shallow: true });
        // Once the filter makes no difference, remove it
        } else {
          const { min_lat: _a, max_lat: _b, min_lng: _c, max_lng: _d, ...otherFilters } = newQuery;
          routerRef.current.replace({ path: '/resources', query: otherFilters }, undefined, { shallow: true });
        }
      },
      50,
    ),
    [],
  );

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map
            resources={filteredResources}
            onMove={onMapMove}
          />
        </div>
        { visibleResources.map((r) => (
          <ResourceCard key={r.id} {...r} />
        )) }
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
