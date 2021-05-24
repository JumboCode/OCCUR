import React, { useMemo } from 'react';
import { RESOURCE_PROP_TYPES } from 'data/resources';
import getICSEvent from 'utils/ics';

export default function CalendarEventDownload(props) {
  const {
    name,
    startTime,
    endTime,
    startDate,
    endDate,
    isRecurring,
    recurrenceDays,
    location: resourceLocation,
    children,
    ...otherProps
  } = props;

  /* eslint-disable react-hooks/exhaustive-deps */
  const calendarString = useMemo(
    () => getICSEvent(props),
    [
      name,
      startTime,
      endTime,
      startDate,
      endDate,
      isRecurring,
      recurrenceDays,
      resourceLocation?.street_address,
      resourceLocation?.location_title,
      resourceLocation?.city,
      resourceLocation?.state,
      resourceLocation?.zip_code,
    ],
  );
  /* eslint-enable */

  return (
    <a
      href={`data:text/plain;charset=utf-8,${encodeURIComponent(calendarString)}`}
      download={`${name}.ics`}
      {...otherProps}
    >
      {children}
    </a>
  );
}

CalendarEventDownload.propTypes = RESOURCE_PROP_TYPES;
