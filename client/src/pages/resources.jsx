import React from 'react';
import PropTypes from 'prop-types';
import ResourceCard from 'components/ResourceCard';
import { get } from 'api';

export default function ResourcesPage({ data }) {
  return (
    <div>
      <h1>Resources</h1>

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
  );
}
ResourcesPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export async function getServerSideProps() {
  const data = await get('/list/resource');

  return {
    props: { data },
  };
}
