import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/Map';

import api from 'api';

import styles from './ResourceSearch.module.scss';


export default function ResourcesPage({ data }) {
  const [values, setValues] = useState([]);
  const router = useRouter();

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map
            resources={data}
            onMove={debounce(({ minLat, maxLat, minLng, maxLng }) => {
              router.replace({
                path: '/resources',
                query: {
                  ...router.query,
                  min_lat: minLat.toFixed(5),
                  max_lat: maxLat.toFixed(5),
                  min_lng: minLng.toFixed(5),
                  max_lng: maxLng.toFixed(5),
                },
              });
            }, 500)}
          />
        </div>
        { data.map((r) => (
          <ResourceCard key={r.id} {...r} />
        )) }
      </div>
    </div>
  );
}
ResourcesPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export async function getServerSideProps(context) {
  const data = await api.get(
    '/resources',
    ['search', 'min_lat', 'max_lat', 'min_lng', 'max_lng']
      .filter((key) => context.query[key])
      .map((key) => ({ [key]: context.query[key] }))
      .reduce((accum, curr) => ({ ...accum, ...curr }), {}),
  );

  return {
    props: { data },
  };
}
