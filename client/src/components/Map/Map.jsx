
import React, { useRef, useEffect, useState } from 'react';
import styles from './Map.module.scss';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
 
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA';
//process.env.MAPBOX_KEY;


// test key from Luke: pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA
export default function Map({values}) {
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


        // Create a default Marker and add it to the map.
        values.forEach((marker) => {
            var marker_html = validate_marker(marker);
            new mapboxgl.Marker()
            .setLngLat(marker.coords)
            .setPopup(new mapboxgl.Popup().setHTML(marker_html))
            .addTo(map);
        });
        

        map.on('move', () => {
            setLat(map.getCenter().lat.toFixed(4));
            setLng(map.getCenter().lng.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return () => {map.remove()};
    }, []);


    return(
        <div className= {styles.map_container} ref={mapContainer} />
    )
}
// https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.5199,37.8782,9,0/300x200?access_token=pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJja25veTRmMjcwMGx2Mm9zMjRrdXhuMmgzIn0.6tfRttzuBrfJOSsjiHrPRA

  /* [{name: resource_data[i].name",
       startDate: resource_data[i].startDate",
       endDate: resource_data[i].endDate", 
       startTime: resource_data[i].startTime",
       endTime: resource_data[i].endTime",
       address:  resource_data[i].location.street_address + ,resource.location.city",
       coords: [-120.26915291754872, 37.80375524992699]}] */
function validate_marker (marker) {
    var toRet = "";

    if (marker.name != null) {
        toRet += "<h3>" + marker.name + "</h3>";
    }
    if (marker.startDate != null && marker.endDate != null) {
        toRet += "<p>" + marker.startDate + " - " + marker.endDate + "</p>";
    }
    if (marker.startTime != null && marker.endTime != null) {
        toRet += "<p>" + marker.startTime + " - " + marker.endTime + "</p>";
    }
    console.log(marker.address);
    if (marker.address != null) {
        toRet += "<p>" + marker.address + "</p>";
    }
    return toRet;
}