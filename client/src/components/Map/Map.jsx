import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { slugify } from 'utils';

import { RESOURCE_PROP_TYPES } from 'data/resources';

import styles from './Map.module.scss';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // eslint-disable-line import/no-unresolved

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const markerHeight = 40;
const markerRadius = 10;
const linearOffset = 25;

const popupOffsets = {
  top: [0, 0],
  'top-left': [0, 0],
  'top-right': [0, 0],
  bottom: [0, -markerHeight],
  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};

export default function Map({ resources, onMove }) {
  const mapContainer = useRef();
  const [map, setMap] = useState(null);
  const mapRef = useRef();
  mapRef.current = map;

  const router = useRouter();

  const isFittingRef = useRef();

  // Set up map
  useEffect(() => {
    setMap(new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.26915291754872, 37.80375524992699],
      zoom: 11,
    }));
    return () => { if (mapRef.current) mapRef.current.remove(); };
  }, []);


  // Set up map event listener
  useEffect(() => {
    if (!map || !onMove) return () => {};

    const handler = () => {
      if (isFittingRef.current) return;
      const bounds = map.getBounds();
      onMove({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast(),
      });
    };
    map.on('move', handler);
    return () => map.off('move', handler);
  }, [map, onMove]);


  // Add markers from props
  useEffect(() => {
    if (!map) return () => {};

    const markers = resources.map(({ name, location, id }) => {
      const lnglat = [location.longitude, location.latitude];

      const newMarker = new mapboxgl.Marker({
        color: '#E1701D',
      })
        .setLngLat(lnglat)
        .addTo(map);
      // Click handler: open resource
      newMarker.getElement().addEventListener('click', () => {
        router.push('/resources/[id]', `/resources/${id}-${slugify(name, 5)}`);
      });
      // Set up popup
      const popup = new mapboxgl.Popup({
        offset: popupOffsets,
        closeButton: false,
        closeOnClick: false,
      }).setMaxWidth('200px');

      newMarker.getElement().addEventListener('mouseover', () => {
        popup
          .setLngLat(lnglat)
          // TODO: this has an XSS vulnerability
          .setHTML(`<h3>${name}</h3><p>${location.street_address}<br>${location.city}, ${location.state}`)
          .addTo(map);
      });
      newMarker.getElement().addEventListener('mouseleave', () => popup.remove());

      return newMarker;
    });

    if (resources.length > 1) {
      isFittingRef.current = true;
      // reverse sort by latitude, choose first one (northmost; highest latitude)
      const coords = resources.map((a) => [a.location.longitude, a.location.latitude]);
      const lngSorted = [...coords].sort((a, b) => a[0] - b[0]);
      const latSorted = [...coords].sort((a, b) => a[1] - b[1]);

      const [bottomPoint, topPoint, leftPoint, rightPoint] = [
        latSorted[0], latSorted.slice(-1)[0], lngSorted[0], lngSorted.slice(-1)[0],
      ].map((latlng) => map.project(latlng));

      const padding = 50;
      // 41 is marker height in px; 14 is its vertical offset from the point we placed it
      const topBound = topPoint.y - (41 + 14) - padding;
      const bottomBound = bottomPoint.y + padding;
      const leftBound = leftPoint.x - padding;
      const rightBound = rightPoint.x + padding;

      const minBoundLngLat = map.unproject([leftBound, bottomBound]);
      const maxBoundLngLat = map.unproject([rightBound, topBound]);

      map.fitBounds([minBoundLngLat, maxBoundLngLat]);
      map.once('moveend', () => { isFittingRef.current = false; });
    } else if (resources.length === 1) {
      isFittingRef.current = true;
      map.setCenter([resources[0].location.longitude, resources[0].location.latitude]);
      map.once('moveend', () => { isFittingRef.current = false; });
    }

    // Clean up: remove old markers
    return () => markers.forEach((m) => m.remove());
  }, [
    map,
    // only refresh when data changes meaningfully
    JSON.stringify(resources.map(({ name, location }) => ({ name, location }))),
  ]);

  return (
    <div className={styles.map_container} ref={mapContainer} />
  );
}

Map.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape(RESOURCE_PROP_TYPES)).isRequired,

  onMove: PropTypes.func,
};
Map.defaultProps = {
  onMove: null,
};
