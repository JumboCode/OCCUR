import React from 'react';
import PropTypes from 'prop-types';
import ResourceCard from 'components/ResourceCard';
import { get } from 'api';

export default function ResourcesPage({ data }) {
  return (
    <div>
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

export async function getServerSideProps(context) {
  const data = await get('/list/resource', {
    search: context.query.search,
  });

  return {
    props: { data },
  };
}
