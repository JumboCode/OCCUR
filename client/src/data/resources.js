import PropTypes from 'prop-types';

export const RESOURCE_CATEGORIES = [
  { id: 'FOOD', label: 'Food' },
  { id: 'HOUSING', label: 'Housing' },
  { id: 'COMM_SERVE', label: 'Community Services' },
  { id: 'MENTAL_HEALTH', label: 'Mental Health' },
  { id: 'EDUCATION', label: 'Education/Information' },
  { id: 'EVENTS', label: 'Events' },
  { id: 'WIFI', label: 'Free Wifi' },
  { id: 'OTHER', label: 'Other' },
];

export const DAYS_OF_WEEK = [
  { id: 'SUN', label: 'Sunday' },
  { id: 'MON', label: 'Monday' },
  { id: 'TUE', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THU', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
  { id: 'SAT', label: 'Saturday' },
];


const datePropType = (props, propName, componentName) => {
  if (!props[propName]) return undefined;
  if (!/\d{4}-\d{2}-\d{2}/.test(props[propName])) {
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected string of form YYYY-MM-DD.`);
  }
  return undefined;
};

const timePropType = (props, propName, componentName) => {
  if (!props[propName]) return undefined;
  if (!/\d{2}:\d{2}:\d{2}/.test(props[propName])) {
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected string of form HH:MM:SS.`);
  }
  return undefined;
};


export const RESOURCE_PROP_TYPES = {
  id: PropTypes.number.isRequired,

  name: PropTypes.string.isRequired,
  organization: PropTypes.string,
  category: PropTypes.oneOf(RESOURCE_CATEGORIES.map(((cat) => cat.id))),

  startDate: datePropType,
  endDate: datePropType,
  startTime: timePropType,
  endTime: timePropType,

  isRecurring: PropTypes.bool,
  recurrenceDays: PropTypes.arrayOf(PropTypes.oneOf(DAYS_OF_WEEK.map((day) => day.id))),

  flyer: PropTypes.string,

  link: PropTypes.string,
  meetingLink: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  description: PropTypes.string,

  location: PropTypes.shape({
    street_address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip_code: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
};

export const RESOURCE_DEFAULT_PROPS = {
  organization: null,
  category: null,

  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,

  isRecurring: false,
  recurrenceDays: null,

  flyer: null,

  link: null,
  meetingLink: null,
  phone: null,
  email: null,
  description: null,

  location: null,
};
