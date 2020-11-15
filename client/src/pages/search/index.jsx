import React, { useState } from 'react';

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
