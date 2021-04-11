import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import api from 'api';

import styles from './resources.module.scss';

export default function ResourcesPage({ data }) {
  const [categoryValues, setCategoryValues] = useState([]);
  const [sortSelectValue, setSortSelectValue] = useState("ascending");
  const sortOrder = sortSelectValue != "ascending";
  function handleSelectChange(event) {
    setSortSelectValue(event.target.value);
  }
  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={categoryValues} onChange={setCategoryValues} />
      </div>

      <div className={styles.right}>
        <select value={sortSelectValue} onChange={handleSelectChange}>
          <option value="ascending">A to Z</option>
          <option value="descending">Z to A</option>
        </select>

        { sortBy(data, sortOrder).map((r) => (
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
  const data = await api.get('/list/resource', context.query.search && {
    search: context.query.search,
  });

  return {
    props: { data },
  };
}

function sortBy(resources, descending) {
  const mult = descending ? -1 : 1;
  return [...resources].sort((a, b) => mult * a.name.localeCompare(b.name));
};

