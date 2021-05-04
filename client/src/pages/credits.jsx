import React from 'react';

import classNames from 'classnames/bind';
import styles from './credits.module.scss';
const cx = classNames.bind(styles);

const data = [
  { role: 'Project Manager', name: 'Keisha Mukasa' },
  { role: 'Engineering Lead', name: 'Luke Deen Taylor', link: 'https://luke.deentaylor.com/' },
  { role: 'Co-Project Lead', name: 'Tina King' },
  { role: 'Designer', name: 'Mikayla Clark' },
  ...[
    { role: 'Developer', name: 'Brendon Bellevue' },
    { role: 'Developer', name: 'Eric Toh' },
    { role: 'Developer', name: 'Eddie Hatfield', link: 'https://eddiehatfield.com/' },
    { role: 'Developer', name: 'Deanna Oei' },
    { role: 'Developer', name: 'Grace Kayode' },
    { role: 'Developer', name: 'Noah Chopra-Khan' },
    { role: 'Developer', name: 'Jackson Parsells' },
    { role: 'Developer', name: 'Rusny Rahman' },
  ].sort((a, b) => a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])),
];

const Credits = () => (
  <div className={cx('base')}>
    <div className={cx('vertical')}>
      <h1>Credits</h1>
      <div className={cx('subhead')}>
        A product of
        {' '}
        <a href="https://jumbocode.org/" target="_blank" rel="noopener noreferrer">JumboCode</a>
        {' '}
        at Tufts University, 2020&ndash;2021.
        <br />
        Created by this incredible team of talented students:
      </div>
      {data.map(({ name, role, link }) => (
        <div className={cx('row')} key={name}>
          { link
            ? <a href={link} target="_blank" rel="noopener noreferrer" className={cx('name')}>{name}</a>
            : <div className={cx('name')}>{name}</div> }
          <div className={cx('line')} />
          <div className={cx('role')}>{role}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Credits;
