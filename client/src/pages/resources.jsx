import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';
import Map from 'components/Map/Map';
import api from 'api';

import styles from './resources.module.scss';


export default function ResourcesPage({ data }) {
  const [values, setValues] = useState([]);
  console.log(data);
  const [markers, setMarkers] = useState(load_markers(data));

  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter values={values} onChange={setValues} />
      </div>

      <div className={styles.right}>
        <div className = {styles.map}>
          <Map values = {markers} onChange={console.log}/>
        </div>
        { data.map((r) => (
          <ResourceCard
            key={r.id}
            resourceTitle={r.name}
            organization={r.organization}
            startDate={r.startDate}
            endDate={r.endDate}
            location={r.location}
            imageSrc={r.flyer}
            startTime={r.startTime}
            endTime={r.endTime}
          />
        )) }
      </div>
    </div>
  );
}
ResourcesPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export async function getServerSideProps(context) {
  const data = await api.get('/list/resource', context.query.search && {
    search: context.query.search,
  });

  return {
    props: { data },
  };
}

function load_markers(resource_data) {
  /* [{name: resource_data[i].name",
       startDate: resource_data[i].startDate",
       endDate: resource_data[i].endDate", 
       startTime: resource_data[i].startTime",
       endTime: resource_data[i].endTime",
       address:  resource_data[i].location.street_address + ,resource.location.city",
       coords: [-120.26915291754872, 37.80375524992699]}] */

  var newData = [];
  let i = 0;
  for (i; i < resource_data.length; i++) {
    if (resource_data[i].location != null) {
      var new_resource = {
        name: resource_data[i].name, 
        address:  resource_data[i].location.street_address + ", " + resource_data[i].location.city,
        coords: [resource_data[i].location.longitude, resource_data[i].location.latitude]}
    }
      newData.push(new_resource);
  }
  return(newData);
}