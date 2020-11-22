import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceCard.module.scss';

export default function ResourceCard({
  resourceTitle, organization, startDate, endDate, location, imageSrc
}) {
  return (
    <div className={styles.container}>
      <h3>{resourceTitle}</h3>
      <p>{organization}</p>
      <p>{startDate.toLocaleDateString()}</p>
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
