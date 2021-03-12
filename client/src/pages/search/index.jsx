import React from 'react';
import ResourceCard from 'components/ResourceCard';
import SidebarFilter from 'components/SidebarFilter/SidebarFilter';

import styles from './search.module.scss';


export default function SearchPage() {
  return (
    <div className={styles.base}>
      <div className={styles.left}>
        <SidebarFilter />
      </div>
      <div className={styles.right}>
        <h1>Search</h1>
        <ResourceCard
          resourceTitle="Oakland Food Drive"
          imageSrc="https://source.unsplash.com/random/600x800?dummy=1"
          href="/"
          organization="Food4Food"
          startDate={new Date('2021-03-17T08:00:00Z')}
          endDate={new Date('2021-03-17T05:00:00Z')}
          location="Alameda Food Bank"
          startTime={new Date('2021-03-17T12:00:00Z')}
          endTime={new Date('2021-03-17T21:00:00Z')}
        />
        <ResourceCard
          resourceTitle="Oakland Food Drive"
          imageSrc="https://source.unsplash.com/random/600x800?dummy=2"
          href="https://occurnow.org/"
          organization="Food4Food"
          startDate={new Date('2021-03-17T08:00:00Z')}
          endDate={new Date('2021-03-17T05:00:00Z')}
          location="Alameda Food Bank"
          startTime={new Date('2021-03-17T12:00:00Z')}
          endTime={new Date('2021-03-17T21:00:00Z')}
        />
      </div>
    </div>
  );
}
