import React from 'react';
import PropTypes from 'prop-types';
import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import api from 'api';
import { useRouter } from 'next/router';

import styles from './resources.module.scss';

export default function ResourcesPage({ data }) {
  const router = useRouter();

  const categories = router.query.category ? router.query.category.split(',') : [];
  const setCategories = (cats) => {
    router.replace({ query: { ...router.query, category: cats.join(',') } });
  };

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={categories} onChange={setCategories} />
      </div>

      <div className={styles.right}>
        { data.map((r) => (
          <ResourceCard
            key={r.id}
            resourceTitle={r.name}
            organization={r.organization}
            startDate={new Date(r.startDate)}
            endDate={new Date(r.startDate)}
            location={r.location}
            imageSrc={r.flyer}
            startTime={new Date(r.time)}
            endTime={new Date(r.time)}
          />
        )) }
      </div>
    </div>
  );
}
ResourcesPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export async function getServerSideProps(context) {
  const params = {};
  if (context.query.search) params.search = context.query.search;
  if (context.query.category) params.category = context.query.category;

  const data = await api.get('/list/resource', params);

  return {
    props: { data },
  };
}
