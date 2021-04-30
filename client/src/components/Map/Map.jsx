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

    const defaultOffset = 0.01;
    const bounds = {
        maxLng: (resources[0].location.longitude + defaultOffset), 
        minLng: (resources[0].location.longitude - defaultOffset), 
        maxLat: (resources[0].location.latitude + defaultOffset), 
        minLat: (resources[0].location.latitude - defaultOffset)
    };

    const markers = resources.map(({ name, location, id }) => {
      const lnglat = [location.longitude, location.latitude];
      if (location.longitude < bounds.minLng) { 
          bounds.minLng = location.longitude 
      }
      if (location.longitude > bounds.maxLng) { 
          bounds.maxLng = location.longitude 
      };
      if (location.latitude < bounds.minLat) { 
          bounds.minLat = location.latitude 
      };
      if (location.latitude > bounds.maxLat) { 
          bounds.maxLat = location.latitude 
      };

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

    map.fitBounds([
        [bounds.minLng - defaultOffset, bounds.minLat - defaultOffset],
        [bounds.maxLng + defaultOffset, bounds.maxLat + defaultOffset]
    ]);

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
