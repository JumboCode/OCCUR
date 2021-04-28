import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Map.module.scss';

import { RESOURCE_PROP_TYPES } from 'data/resources';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // eslint-disable-line import/no-unresolved

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA';

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

export default function Map({ values, onChange }) {
  const mapContainer = useRef();
  const [map, setMap] = useState(null);
  const mapRef = useRef();
  mapRef.current = map;

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
    if (!map || !onChange) return () => {};

    const handler = () => {
      const bounds = map.getBounds();
      onChange({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast(),
      });
    };
    map.on('move', handler);
    return () => map.off('move', handler);
  }, [map, onChange]);


  // Add markers from props
  useEffect(() => {
    if (!map) return () => {};

    const markers = values.map(({ name, location }) => {
      const lnglat = [location.longitude, location.latitude];
      const newMarker = new mapboxgl.Marker({
        color: '#E1701D',
      })
        .setLngLat(lnglat)
        .addTo(map);
      // Click handler: open resource
      newMarker.getElement().addEventListener('click', () => { /* TODO: navigate to resource */ });
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

    // Clean up: remove old markers
    return () => markers.forEach((m) => m.remove());
  }, [
    map,
    // only refresh when values change meaningfully
    JSON.stringify(values.map(({ name, location }) => ({ name, location }))),
  ]);

  return (
    <div className={styles.map_container} ref={mapContainer} />
  );
}

Map.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape(RESOURCE_PROP_TYPES)).isRequired,

  onChange: PropTypes.func,
};
Map.defaultProps = {
  onChange: null,
};
