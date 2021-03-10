import React, { useState } from 'react';
import ResourceCard from 'components/ResourceCard';

const searchResults = [
  { name: 'My first result', description: 'hi' },
  { name: 'My second result', description: 'this is the second result' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <h1>Search</h1>
      <input
        type="text"
        placeholder="Enter your search here"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ResourceCard
        resourceTitle="Oakland Food Drive"
        imageSrc="https://source.unsplash.com/random/600x800?dummy=1"
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
        organization="Food4Food"
        startDate={new Date('2021-03-17T08:00:00Z')}
        endDate={new Date('2021-03-17T05:00:00Z')}
        location="Alameda Food Bank"
        startTime={new Date('2021-03-17T12:00:00Z')}
        endTime={new Date('2021-03-17T21:00:00Z')}
      />

      <div>
        {
          searchResults
            .filter((s) => s.name.includes(query))
            .map((s) => (
              <div key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))
        }
      </div>
    </div>
  );
}
