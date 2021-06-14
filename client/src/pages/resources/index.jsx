import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import { useRouter } from 'next/router';
import { isAdmin } from 'auth';
import unauthenticatedApi, { useApi } from 'api';

import throttle from 'lodash/throttle';
import omit from 'lodash/omit';
import filterResources, { geoFilterResources } from 'utils/filters';

import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/lazy';
import AddResourceModal from 'components/AddResourceModal';

import Exclamation from '../../../public/icons/exclamation.svg';
import Arrow from '../../../public/icons/arrow.svg';
import Circleplus from '../../../public/icons/circle_plus.svg';

import classNames from 'classnames/bind';
import styles from './ResourceSearch.module.scss';

const cx = classNames.bind(styles);

const get12Hour = (str) => {
  let h = parseInt(str, 10);
  if (Number.isNaN(h)) return '';
  // adjust to 12 hours
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return h.toString().padStart(str.length, '0');
};

const get24Hour = (hour, period) => (Number.isNaN(parseInt(hour, 10))
  ? undefined
  : ((parseInt(hour, 10) + ({ AM: hour === '12' ? 12 : 0, PM: hour === '12' ? 0 : 12 })[period]) % 24).toString().padStart(hour.length, '0'));


export default function ResourcesPage({ blocked, data: passedResources }) {
  const [resources, setResources] = useState(passedResources);
  const routerRef = useRef();
  const router = useRouter();
  const mapRef = useRef();
  const sidebarFilterRef = useRef();
  const api = useApi();

  routerRef.current = router;

  const sidebarFilterState = {
    categories: router.query.categories ? router.query.categories.split(',') : [],
    daysOfWeek: router.query.daysOfWeek ? router.query.daysOfWeek.split(',') : [],
    startTime: {
      hour: get12Hour(router.query.startHour),
      min: router.query.startMinute || '',
      timePeriod: router.query.startHour && parseInt(router.query.startHour, 10) >= 12 ? 'PM' : 'AM',
    },
    endTime: {
      hour: get12Hour(router.query.endHour),
      min: router.query.endMinute || '',
      timePeriod: router.query.endHour && parseInt(router.query.endHour, 10) >= 12 ? 'PM' : 'AM',
    },
    startDate: {
      month: router.query.startMonth || '',
      day: router.query.startDay || '',
      year: router.query.startYear || '',
    },
    endDate: {
      month: router.query.endMonth || '',
      day: router.query.endDay || '',
      year: router.query.endYear || '',
    },
  };
  const sidebarFilterStateRef = useRef();
  sidebarFilterStateRef.current = sidebarFilterState;

  const filteredResourcesRef = useRef();
  const filteredResources = filterResources(resources, { ...router.query, ...sidebarFilterState });
  filteredResourcesRef.current = filteredResources;
  const visibleResources = geoFilterResources(filteredResources, router.query);
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [openAddResourceModal, setopenAddResourceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const refreshData = () => {
    api.get('resources').then(setResources);
  };

  const setQueryParams = useCallback((params) => {
    const oldQuery = omit(routerRef.current.query, Object.keys(params));
    routerRef.current.replace({
      path: '/resources',
      query: {
        ...oldQuery,
        // Exclude completely keys that are set to undefined
        ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v !== 'undefined')),
      },
    }, undefined, { shallow: true });
  }, []);

  const onMapMove = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
    throttle(
      ({ minLat, maxLat, minLng, maxLng }) => {
        const newQuery = {
          min_lat: minLat.toFixed(5),
          max_lat: maxLat.toFixed(5),
          min_lng: minLng.toFixed(5),
          max_lng: maxLng.toFixed(5),
        };
        // If the filter makes a difference, apply it
        const currentResourceSet = filteredResourcesRef.current;
        const resourcesWithLoc = currentResourceSet.filter((r) => r.location);
        if (geoFilterResources(currentResourceSet, newQuery).length < resourcesWithLoc.length) {
          setQueryParams(newQuery);
        // Once the filter makes no difference, remove it
        } else {
          setQueryParams(Object.fromEntries(Object.entries(newQuery).map(([k]) => [k, undefined])));
        }
      },
      50,
    ),
    [],
  );
  // sends request to create a resource based on resource passed from form
  const addResource = async (resource) => {
    try {
      await api.post('resources', undefined, resource);
      console.log(resources);
      setErrorMessage(null);
      refreshData();
      return true;
    } catch (errors) {
      console.log('status code: ', errors.status);
      if (errors.status === 400 && errors.body) {
        console.log('errors: ', errors.body);
        console.log('errors type: ', typeof errors.body);
        setErrorMessage(JSON.stringify(errors.body));
      }
      return false;
    }
  };

  const updateSidebarFilters = useCallback(({
    categories,
    daysOfWeek,
    startTime: { hour: startHour, min: startMinute, timePeriod: startTimePeriod },
    endTime: { hour: endHour, min: endMinute, timePeriod: endTimePeriod },
    startDate: { month: startMonth, day: startDay, year: startYear },
    endDate: { month: endMonth, day: endDay, year: endYear },
  }) => {
    setQueryParams({
      categories: categories.join(',') || undefined,
      daysOfWeek: daysOfWeek.join(',') || undefined,
      startHour: get24Hour(startHour, startTimePeriod),
      startMinute: startMinute || undefined,
      endHour: get24Hour(endHour, endTimePeriod),
      endMinute: endMinute || undefined,
      startMonth: startMonth || undefined,
      startDay: startDay || undefined,
      startYear: startYear || undefined,
      endMonth: endMonth || undefined,
      endDay: endDay || undefined,
      endYear: endYear || undefined,
    });
  }, [setQueryParams]);

  // Apply updates to a subset of sidebar filters without passing the full list
  const mergeSidebarFilters = useCallback(
    (updates) => updateSidebarFilters({ ...sidebarFilterStateRef.current, ...updates }),
    [updateSidebarFilters],
  );

  // IMPORTANT: running multiple updates at the same time creates issues because each update
  //            reinstates a value that the previous update had asked to change. The following code
  //            detects whether a state update is scheduled, and then batches all updates that come
  //            before it's finished into a single group. Then, when the first state update is done,
  //            we safely apply all of the scheduled updates based on the new, settled state,
  //            thereby avoiding bugs that reapplied stale values

  // Track whether a querystring update is in progress
  const routeChanging = useRef(false);
  useEffect(() => {
    const a = () => { routeChanging.current = true; };
    const b = () => { routeChanging.current = false; };
    router.events.on('routeChangeStart', a);
    router.events.on('routeChangeComplete', b);
    return () => {
      router.events.off('routeChangeStart', a);
      router.events.off('routeChangeComplete', b);
    };
  }, [router]);
  // While route is changing, accumulate scheduled updates without trying to apply them yet
  const scheduledUpdates = useRef({});
  const safeMergeSidebarFilters = useCallback((updates) => {
    if (routeChanging.current) {
      scheduledUpdates.current = { ...scheduledUpdates.current, ...updates };
    } else {
      mergeSidebarFilters(updates);
    }
  }, [mergeSidebarFilters]);
  // Once route is finished changing based on the first update, apply all accumulated updates
  useEffect(() => {
    const applyScheduledUpdates = () => {
      if (Object.keys(scheduledUpdates.current).length) {
        mergeSidebarFilters(scheduledUpdates.current);
        scheduledUpdates.current = {};
      }
    };
    router.events.on('routeChangeComplete', applyScheduledUpdates);
    return () => { router.events.off('routeChangeComplete', applyScheduledUpdates); };
  }, [router, mergeSidebarFilters]);


  return (

    <div className={styles.base}>
      <AddResourceModal
        open={openAddResourceModal}
        close={setopenAddResourceModal}
        errorMessage={errorMessage}
        submit={addResource}
      />
      <div className={styles.left}>
        <SidebarFilter
          ref={sidebarFilterRef}
          values={sidebarFilterState}
          onChange={safeMergeSidebarFilters}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.map}>
          <Map
            resources={filteredResources}
            onMove={onMapMove}
            ref={mapRef}
          />
        </div>
        <div className={cx('results-summary', { empty: !visibleResources.length })}>
          {
          // If user is logged in as an admin, show the add resource button
          !blocked && (
            <div className={cx('buttonContainer')}>
              <button className={cx('addResource')} type="button" onClick={() => setopenAddResourceModal(true)}>
                <Circleplus className={cx('circleIcon')} />
                <div
                  className={cx('addResourceButton')}
                >
                  Add Resource
                </div>
              </button>
            </div>
          )
          }
          <div className={cx('message')}>
            {visibleResources.length ? visibleResources.length : 'No'}
            {' resource'}
            {visibleResources.length === 1 ? ' ' : 's '}
            found
          </div>
          <button
            type="button"
            className={cx('clear')}
            onClick={() => {
              mapRef.current.resetBounds();
              sidebarFilterRef.current.clearInputs();
              router.replace('/resources', undefined, { shallow: true });
            }}
          >
            Clear filters
          </button>
        </div>

        <div className={cx('dropDownFilter')}>
          <button type="button" className={cx('dropDownFilterButton')} onClick={() => { setDropDownToggle(!dropDownToggle); }}>
            Filters
            <Arrow className={cx({ 'arrow-show': dropDownToggle, 'arrow-hidden': !dropDownToggle })} />
          </button>
          {dropDownToggle ? (
            <div className={cx('dropDownFilterCategories')}>
              <SidebarFilter
                values={sidebarFilterState}
                onChange={updateSidebarFilters}
              />
            </div>
          ) : null}

        </div>

        {/* {visibleResources?.length > 0
          ? visibleResources.map((r) => <ResourceCard key={r.id} {...r} />) */}
        {visibleResources?.length > 0
          // Fill in each resource card
          ? visibleResources.map((r) => (
            <ResourceCard
              key={r.id}
              r={r}
              blocked={blocked}
              onResourceDeleted={refreshData}
              onResourceEdited={refreshData}
            />
          ))
          : (
            <div className={styles.noResults}>
              <Exclamation className={styles.exclamation} />
              <h4>No results found.</h4>
              <div>We cannot find any matching resources.</div>
            </div>
          )}

      </div>
    </div>
  );
}
ResourcesPage.propTypes = {
  blocked: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(RESOURCE_PROP_TYPES)).isRequired,
};

export async function getServerSideProps(ctx) {
  const blocked = !isAdmin(ctx);
  return {
    props: { blocked, data: await unauthenticatedApi.get('resources') },
  };
}
