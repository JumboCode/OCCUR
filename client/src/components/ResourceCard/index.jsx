import React, { useCallback, useRef,  useState } from 'react';

import { RESOURCE_PROP_TYPES, RESOURCE_DEFAULT_PROPS } from 'data/resources';
import styles from './ResourceCard.module.scss';

import Link from 'next/link';
import { DateRange, TimeRange } from 'components/DateRange';
import { useApi } from 'api';
import DeleteResourceModal from 'components/DeleteResourceModal'
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
blocked, }) {
  const api = useApi();

  const defaultImage = `/images/category-defaults/${category || 'OTHER'}.jpeg`;
  const [openDeleteResourceModal, setopenDeleteResourceModal] = useState(false);
  const [resourceIDToDelete, setResourceIDToDelete] = useState(null);

  
  const handleDeleteClick = (resourceID) => {
    setopenDeleteResourceModal(true);
    console.log("got to handleDeleteClick")
    console.log(openDeleteResourceModal)

    setResourceIDToDelete(resourceID);
  };

  const deleteResource = (idToDelete) => {
    api.delete(`resources/${idToDelete}`)
      .then((response) =>{
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className={styles.base}>
      <DeleteResourceModal
        open={openDeleteResourceModal}
        close={setopenDeleteResourceModal}
        resourceID={resourceIDToDelete}
        submit={deleteResource}
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
          <button type="button" onClick={() => handleDeleteClick(id)}>
            <TrashIcon />
            Delete
          </button>
          <button type="button" >
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
