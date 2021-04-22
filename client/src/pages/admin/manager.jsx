import React from 'react';
import PropTypes from 'prop-types';
import { isAdmin } from 'auth';
import NotFound from 'pages/404';
import styles from './manager.module.scss';

import classNames from 'classnames/bind';
import Circleplus from '../../../public/icons/circle_plus.svg';


const cx = classNames.bind(styles);

// temporary list of admin users
const ADMINUSERS = [
  {
    name: 'Keisha Mukasa',
    email: 'keisha.mukasa@gmail.com',
  },
  {
    name: 'Eddie Hatfield',
    email: 'eddie.hatfield@whatever.com',
  },
  {
    name: 'Tina King',
    email: 'tina.king@whatever.com',
  },
  {
    name: 'Luke Taylor',
    email: 'luke.taylor@whatever.com',
  },
];

export default function AdminManager({ blocked }) {
  return blocked ? <NotFound /> : (
    <div className={cx('base')}>
      <div className={cx('buttonContainer')}>
        <div className={cx('addAdmin')}>
          <Circleplus className={cx('circleIcon')} />
          <button className={cx('addAdminButton')} type="button">Add Admin</button>
        </div>
      </div>
      <div className={cx('adminList')}>
        <h4 className={cx('adminListTitle')}>Admin List</h4>
        {ADMINUSERS.map((user) => (
          <div className={cx('adminUser')}>
            <input className={cx('adminName')} type="text" value={user.name} />
            <div className={cx('verticalBreak')} />
            <input className={cx('adminEmail')} type="text" value={user.email} />
          </div>
        ))}
      </div>
    </div>
  );
}

AdminManager.propTypes = {
  blocked: PropTypes.bool.isRequired,
};

export function getServerSideProps(ctx) {
  const blocked = !isAdmin(ctx);
  if (blocked) ctx.res.statusCode = 404;
  return { props: { blocked } };
}
