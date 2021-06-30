import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { RESOURCE_PROP_TYPES, RESOURCE_DEFAULT_PROPS } from 'data/resources';
import styles from './ResourceCard.module.scss';

import Link from 'next/link';
import { DateRange, TimeRange } from 'components/DateRange';
import { useApi } from 'api';
import CalendarEventDownload from 'components/CalendarEventDownload';

import EditResourceModal from 'components/EditResourceModal';
import DeleteResourceModal from 'components/DeleteResourceModal';


import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';
import TrashIcon from '../../../public/icons/trash.svg';
import PenIcon from '../../../public/icons/pencil.svg';
import { slugify } from 'utils';


export default function ResourceCard({ r, blocked, onResourceDeleted, onResourceEdited }) {
  const api = useApi();

  const defaultImage = `/images/category-defaults/${r.category || 'OTHER'}.jpeg`;
  const [openDeleteResourceModal, setopenDeleteResourceModal] = useState(false);
  const [openEditResourceModal, setopenEditResourceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDeleteClick = () => { setopenDeleteResourceModal(true); };
  const handleEditClick = () => { setopenEditResourceModal(true); };

  const deleteResource = () => {
    api.delete(`resources/${r.id}`)
      .then((response) => {
        onResourceDeleted();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editResource = async (resource) => {
    try {
      await api.put(`resources/${r.id}`, undefined, resource);
      setErrorMessage(null);
      onResourceEdited();
      return true;
    } catch (errors) {
      if (errors.status === 400 && errors.body) {
        console.log('errors: ', errors.body);
        console.log('errors type: ', typeof (errors.body));
        setErrorMessage(JSON.stringify(errors.body));
      }
      return false;
    }
  };

  return (
    <div className={styles.base}>
      <DeleteResourceModal
        open={openDeleteResourceModal}
        close={setopenDeleteResourceModal}
        resourceID={r.id}
        submit={deleteResource}
      />
      <EditResourceModal
        open={openEditResourceModal}
        close={setopenEditResourceModal}
        errorMessage={errorMessage}
        resource={r}
        submit={editResource}
      />
      <div className={styles.leftside}>
        <img alt="Resource flyer" src={r.flyer || defaultImage} />
      </div>
      <div className={styles.rightside}>
        <div className={styles.content}>
          <h3>{r.name}</h3>
          {r.organization && <p className={styles.subtitle}>{r.organization}</p>}
          { (r.startDate || r.endDate) && (
            <p className={styles['icon-line']}>
              <CalendarIcon />
              <DateRange from={r.startDate} to={r.endDate} />
            </p>
          )}
          {
            (r.startTime || r.endTime) && (
              <p className={styles['icon-line']}>
                <ClockIcon />
                <TimeRange from={r.startTime} to={r.endTime} />
              </p>
            )
          }
          {
            r.location && (
              <p className={styles['icon-line']}>
                <PinIcon />
                {[r.location?.street_address, r.location?.city].filter((n) => n).join(', ')}
              </p>
            )
          }
        </div>

        <Link href="/resources/[id]" as={`/resources/${r.id}-${slugify(r.name, 5)}`}>
          <a className={styles.cta}>
            <span className={styles.viewMsg}>View more</span>
            <ViewIcon />
          </a>
        </Link>

        {
          blocked
            ? (
              <div className={styles.buttons}>
                <CalendarEventDownload
                  id={r.id}
                  name={r.name}
                  startTime={r.startTime}
                  endTime={r.endTime}
                  startDate={r.startDate}
                  endDate={r.endDate}
                  isRecurring={r.isRecurring}
                  recurrenceDays={r.recurrenceDays}
                  location={r.location}
                >
                  <Calendar2Icon />
                  Add to Calendar
                </CalendarEventDownload>

                <button type="button">
                  <ShareIcon />
                  Share
                </button>
              </div>
            )
            : (
              <div className={styles.buttons}>
                <button type="button" onClick={handleDeleteClick}>
                  <TrashIcon />
                  Delete
                </button>
                <button type="button" onClick={handleEditClick}>
                  <PenIcon />
                  Edit
                </button>
              </div>
            )
        }
      </div>
    </div>
  );
}

ResourceCard.propTypes = {
  r: PropTypes.shape(RESOURCE_PROP_TYPES),
  blocked: PropTypes.bool.isRequired,
  onResourceDeleted: PropTypes.func.isRequired,
  onResourceEdited: PropTypes.func.isRequired,
};
ResourceCard.defaultProps = {
  r: RESOURCE_DEFAULT_PROPS,
};
