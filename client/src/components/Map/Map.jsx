import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Map.module.scss';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // eslint-disable-line import/no-unresolved

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA';


function markerToHtml({ name, address }) {
  const namePart = `<h3>${name}</h3>`;
  const addressPart = `<p>${address}</p>`;

  return (name ? namePart : '') + (address ? addressPart : '');
}

export default function Map({ values, onChange }) {
  // will probably end up being data passed to the map function

  const mapContainer = useRef();
  const [lat, setLat] = useState(-122.26915291754872);
  const [lng, setLng] = useState(37.80375524992699);
  const [zoom, setZoom] = useState(11);


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lat, lng],
      zoom,
    });

    /* Fit bounds?
    var bounds = new mapboxgl.LngLatBounds();
      markers.features.forEach(function(feature) {
      bounds.extend(feature.geometry.coordinates);
    });
    map.fitBounds(bounds); */


    // Create a default Marker and add it to the map.
    values.forEach((marker) => {
      const newMarker = new mapboxgl.Marker({
        color: '#E1701D',
      })
        .setLngLat(marker.coords)
        .addTo(map);

      newMarker.getElement().addEventListener('click', () => {
        // TODO: navigate to resource
      });

      // popup configuration
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

      const popup = new mapboxgl.Popup({
        offset: popupOffsets,
        closeButton: false,
        closeOnClick: false
      }).setMaxWidth('200px');


      newMarker.getElement().addEventListener('mouseover', () => {
        popup.setLngLat(marker.coords).setHTML(markerToHtml(marker)).addTo(map);
      });

      newMarker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });
    });

    map.on('move', () => {
      setLat(map.getCenter().lat.toFixed(4));
      setLng(map.getCenter().lng.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
      const bounds = map.getBounds();
      onChange({
        minLat: bounds.getSouth().toFixed(4),
        maxLat: bounds.getNorth().toFixed(4),
        minLong: bounds.getWest().toFixed(4),
        maxLong: bounds.getEast().toFixed(4),
      });
    });

    return () => { map.remove(); };
  }, []);


  return (
    <div className={styles.map_container} ref={mapContainer} />
  );
}

Map.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
    address: PropTypes.string,
  })).isRequired,

  onChange: PropTypes.func,
};
Map.defaultProps = {
  onChange: null,
};
