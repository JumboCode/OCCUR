
import React, { useRef, useEffect, useState } from 'react';
import styles from './Map.module.scss';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
 
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA';
//process.env.MAPBOX_KEY;


// test key from Luke: pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA
export default function Map({values, onChange}) {
    // will probably end up being data passed to the map function

    // occur – 37.80375524992699, -122.26915291754872
    const mapContainer = useRef();
    const [lat, setLat] = useState(-122.26915291754872);
    const [lng, setLng] = useState(37.80375524992699);
    const [zoom, setZoom] = useState(11);


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lat, lng],
            zoom: zoom
        });

        /* Fit bounds? 
        var bounds = new mapboxgl.LngLatBounds();
            markers.features.forEach(function(feature) {
            bounds.extend(feature.geometry.coordinates);
        });
        map.fitBounds(bounds); */


        // Create a default Marker and add it to the map.
        values.forEach((marker) => {
            var marker_html = validate_marker(marker);
            var new_marker = new mapboxgl.Marker({
                color: '#E1701D'
            })
            .setLngLat(marker.coords)
            .addTo(map);

            new_marker.getElement().addEventListener('click', () => {
                window.open(
                    'https://www.google.com',
                    '_blank' // <- This is what makes it open in a new window.
                  );
            });
            
            // popup configuration
            var markerHeight = 40, markerRadius = 10, linearOffset = 25;
            var popupOffsets = {
                'top': [0, 0],
                'top-left': [0,0],
                'top-right': [0,0],
                'bottom': [0, -markerHeight],
                'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'left': [markerRadius, (markerHeight - markerRadius) * -1],
                'right': [-markerRadius, (markerHeight - markerRadius) * -1]
            };

            var popup = new mapboxgl.Popup({
                offset: popupOffsets,
                closeButton: false,
                closeOnClick: false
            }).setMaxWidth("200px");


            new_marker.getElement().addEventListener('mouseover', () => {
                popup.setLngLat(marker.coords).setHTML(marker_html).addTo(map);
            });
            
            new_marker.getElement().addEventListener('mouseleave', () => {
                popup.remove();
            });
        });

        map.on('move', () => {
            setLat(map.getCenter().lat.toFixed(4));
            setLng(map.getCenter().lng.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
            var bounds = map.getBounds();
            onChange({minLat: bounds.getSouth().toFixed(4), 
                      maxLat: bounds.getNorth().toFixed(4), 
                      minLong: bounds.getWest().toFixed(4), 
                      maxLong: bounds.getEast().toFixed(4)});
        });

        return () => {map.remove()};
    }, []);


    return(
        <div className= {styles.map_container} ref={mapContainer} />
    )
}

function validate_marker (marker) {
    var toRet = "";

    if (marker.name != null) {
        toRet += "<h3>" + marker.name + "</h3>";
    }
    if (marker.address != null) {
        toRet += "<p>" + marker.address + "</p>";
    }
    return toRet;
}