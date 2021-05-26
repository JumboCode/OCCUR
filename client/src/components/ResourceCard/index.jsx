import React, { useCallback, useRef,  useState } from 'react';

import { RESOURCE_PROP_TYPES, RESOURCE_DEFAULT_PROPS } from 'data/resources';
import styles from './ResourceCard.module.scss';

import Link from 'next/link';
import { DateRange, TimeRange } from 'components/DateRange';
import { useApi } from 'api';
import DeleteResourceModal from 'components/DeleteResourceModal'
import EditResourceModal from 'components/EditResourceModal'
import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';
import TrashIcon from '../../../public/icons/trash.svg';
import PenIcon from '../../../public/icons/pencil.svg';
import { slugify } from 'utils';




export default function ResourceCard({
  id, name, organization, category, startDate, endDate, location, flyer, startTime, endTime,
blocked, onResourceDeleted, onResourceEdited }) {
  const api = useApi();

  const defaultImage = `/images/category-defaults/${category || 'OTHER'}.jpeg`;
  const [openDeleteResourceModal, setopenDeleteResourceModal] = useState(false);
  const [openEditResourceModal, setopenEditResourceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDeleteClick = () => { setopenDeleteResourceModal(true); };
  const handleEditClick = () => { setopenEditResourceModal(true); };

  const deleteResource = () => {
    api.delete(`resources/${id}`)
      .then((response) =>{
        onResourceDeleted();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editResource = async (resource) => {
    try{
      await api.put(`resources/${id}`, undefined, resource)
      setErrorMessage(null);
      onResourceEdited();
      return true;

    }catch(errors){
      if(errors.status == 400 && errors.body){
        console.log("errors: ", errors.body);
        console.log("errors type: ", typeof(errors.body));
        setErrorMessage(JSON.stringify(errors.body));
      }
      return false;
    }
  }

  return (
    <div className={styles.base}>
      <DeleteResourceModal
        open={openDeleteResourceModal}
        close={setopenDeleteResourceModal}
        resourceID={id}
        submit={deleteResource}
      />
      <EditResourceModal
        open={openEditResourceModal}
        close={setopenEditResourceModal}
        resourceID={id}
        submit={editResource}
      />
      <div className={styles.leftside}>
        <img alt="Resource flyer" src={flyer || defaultImage} />
      </div>

      <div className={styles.rightside}>
        <div className={styles.content}>
          <h3>{name}</h3>
          {organization && <p className={styles.subtitle}>{organization}</p>}
          { (startDate || endDate) && (
            <p className={styles['icon-line']}>
              <CalendarIcon />
              <DateRange from={startDate} to={endDate} />
            </p>
          )}
          {
            (startTime || endTime) && (
              <p className={styles['icon-line']}>
                <ClockIcon />
                <TimeRange from={startTime} to={endTime} />
              </p>
            )
          }
          {
            location && (
              <p className={styles['icon-line']}>
                <PinIcon />
                {[location?.street_address, location?.city].filter((n) => n).join(', ')}
              </p>
            )
          }
        </div>

        <Link href="/resources/[id]" as={`/resources/${id}-${slugify(name, 5)}`}>
          <a className={styles.cta}>
            View more
            <ViewIcon />
          </a>
        </Link>

        {
        blocked ?
        <div className={styles.buttons}>
          <button type="button">
            <Calendar2Icon />
            Add to Calendar
          </button>
          <button type="button">
            <ShareIcon />
            Share
          </button>
        </div>
        :
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
        }
      </div>
    </div>
  );
}

ResourceCard.propTypes = RESOURCE_PROP_TYPES;
ResourceCard.defaultProps = RESOURCE_DEFAULT_PROPS;
