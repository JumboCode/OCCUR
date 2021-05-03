import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { escapeHTML, slugify } from 'utils';

import { RESOURCE_PROP_TYPES } from 'data/resources';

import styles from './Map.module.scss';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import geoViewport from '@mapbox/geo-viewport';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // eslint-disable-line import/no-unresolved

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const markerHeight = 40;
const markerOffset = 14;
const padding = 35;
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

const mapPadding = {
  top: padding + markerHeight - markerOffset,
  bottom: padding - markerOffset,
  left: padding,
  right: padding,
};

export default function Map({ resources, onMove }) {
  const locationResources = resources.filter((r) => r.location);
  const mapContainer = useRef();
  const [map, setMap] = useState(null);
  const mapRef = useRef();
  mapRef.current = map;

  const router = useRouter();
  const routerRef = useRef();
  routerRef.current = router;

  const isFittingRef = useRef(0);

  // Set up map
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.26915291754872, 37.80375524992699],
      zoom: 11,
    });
    newMap.addControl(new mapboxgl.NavigationControl());
    setMap(newMap);
    return () => { newMap.remove(); };
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
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    };
    map.on('move', handler);
    return () => map.off('move', handler);
  }, [map, onMove]);

  // get { minLat, minLng, maxLat, maxLng } object approate for 'onMove' from a target center/zoom
  const getBounds = useCallback((center, zoom) => {
    const dpr = window.devicePixelRatio || 1;
    const [minLng, minLat, maxLng, maxLat] = geoViewport.bounds(
      [center.lng, center.lat],
      zoom,
      [mapContainer.current.offsetWidth / dpr, mapContainer.current.offsetHeight / dpr],
    );
    return { minLat, minLng, maxLat, maxLng };
  }, []);

  // Add markers from props and zoom to fit
  useEffect(() => {
    if (!map) return () => {};

    const markers = locationResources
      .filter(({ location }) => location)
      .map(({ name, location, id }) => {
        const lnglat = [location.longitude, location.latitude];

        const newMarker = new mapboxgl.Marker({
          color: '#E1701D',
        })
          .setLngLat(lnglat)
          .addTo(map);
        // Click handler: open resource
        newMarker.getElement().addEventListener('click', () => {
          routerRef.current.push('/resources/[id]', `/resources/${id}-${slugify(name, 5)}`);
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
            .setHTML(`<h3>${escapeHTML(name)}</h3><p>${escapeHTML(location.street_address)}<br>${escapeHTML(location.city)}, ${escapeHTML(location.state)}`)
            .addTo(map);
        });
        newMarker.getElement().addEventListener('mouseleave', () => popup.remove());

        return newMarker;
      });

    if (locationResources.length > 1) {
      isFittingRef.current = true;
      const bounds = locationResources
        .map((a) => [a.location.longitude, a.location.latitude])
        .reduce((accum, current) => accum.extend(current), new mapboxgl.LngLatBounds());

      const options = { padding: mapPadding, maxZoom: 15 };
      map.fitBounds(bounds, options);

      if (onMove) {
        // Calculate and report what the final resting position will be
        const camera = map.cameraForBounds(bounds, options);
        onMove(getBounds(camera.center, camera.zoom));
      }
      map.once('moveend', () => { isFittingRef.current = false; });
    } else if (locationResources.length === 1) {
      isFittingRef.current = true;
      const { latitude: lat, longitude: lng } = locationResources[0].location;
      const center = { lat, lng }; const zoom = 12;
      map.flyTo({ center, zoom });
      if (onMove) onMove(getBounds(center, zoom));
      map.once('moveend', () => { isFittingRef.current = false; });
    }

    // Clean up: remove old markers
    return () => markers.forEach((m) => m.remove());
  },
  /* eslint-disable react-hooks/exhaustive-deps */
  [
    map,
    // only refresh when data changes meaningfully
    JSON.stringify(resources.map(({ name, location, id }) => ({ name, location, id }))),
    onMove,
  ]);
  /* eslint-enable */

  return (
    <div className={styles.map_container} ref={mapContainer} />
  );
}

Map.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({
    id: RESOURCE_PROP_TYPES.id,
    name: RESOURCE_PROP_TYPES.name,
    location: RESOURCE_PROP_TYPES.location,
  })).isRequired,

  onMove: PropTypes.func,
};
Map.defaultProps = {
  onMove: null,
};
