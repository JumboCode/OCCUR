import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/Map';

import api from 'api';

import styles from './ResourceSearch.module.scss';


function loadMarkers(resourceData) {
  const newData = [];
  for (let i = 0; i < resourceData.length; i += 1) {
    if (resourceData[i].location != null) {
      const newResource = {
        name: resourceData[i].name,
        address: `${resourceData[i].location.street_address}, ${resourceData[i].location.city}`,
        coords: [resourceData[i].location.longitude, resourceData[i].location.latitude]
      };
      newData.push(newResource);
    }
  }
  return newData;
}

export default function ResourcesPage({ data }) {
  const [values, setValues] = useState([]);
  const [markers, setMarkers] = useState(loadMarkers(data));

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map values={markers} />
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
  const data = await api.get('/list/resource', context.query.search && {
    search: context.query.search,
  });

  return {
    props: { data },
  };
}
