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
    name: 'Luke Taylor',
    email: 'luketaylor@notrealemail.com',
  },
];

export default function AdminManager({ blocked }) {
  return blocked ? <NotFound /> : (
    <div className={cx('base')}>
      <div className={cx('addAdmin')}>
        <Circleplus className={cx('circleIcon')} />
        <button className={cx('AddAdminButton')} type="button">Add Admin</button>
      </div>
      {/* {ADMINUSERS.map((user) => (
        <div className={cx('AdminUser')}>
          <input className={cx('AdminName')} type="text" value={user.name} />
          <input className={cx('AdminEmail')} type="text" value={user.email} />
        </div>
      ))} */}
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
