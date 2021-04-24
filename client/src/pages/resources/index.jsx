import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';

import api from 'api';

import styles from './ResourceSearch.module.scss';

export default function ResourcesPage({ data }) {
  const [values, setValues] = useState([]);

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
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
