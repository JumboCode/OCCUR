import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import { useRouter } from 'next/router';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/Map';

import api from 'api';

import styles from './ResourceSearch.module.scss';

function filterResources(resources, filters) {
  // TODO: filters here
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

  const router = useRouter();
  const filteredResources = filterResources(resources, router.query);
  const visibleResources = geoFilterResources(filteredResources, router.query);

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map
            resources={filteredResources}
            onMove={({ minLat, maxLat, minLng, maxLng }) => {
              router.replace({
                path: '/resources',
                query: {
                  ...router.query,
                  min_lat: minLat.toFixed(5),
                  max_lat: maxLat.toFixed(5),
                  min_lng: minLng.toFixed(5),
                  max_lng: maxLng.toFixed(5),
                },
              }, undefined, { shallow: true });
            }}
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
