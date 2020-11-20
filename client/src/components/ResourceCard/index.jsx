import React from 'react';
import PropTypes from 'prop-types';
import './ResourceCard.module.scss';

export default function ResourceCard({
  resourceTitle, organization, startDate, endDate, location, imageSrc
}) {
  return (
    <div className="container">
      <h1>{resourceTitle}</h1>
      <h1>{organization}</h1>
    </div>
  );
}

ResourceCard.propTypes = {
  resourceTitle: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  location: PropTypes.string.isRequired,

};
