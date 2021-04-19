import React from 'react';
import PropTypes from 'prop-types';
import { isAdmin } from 'auth';
import NotFound from 'pages/404';
import styles from './manager.modules.scss';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
  
// temporary list of admin users
const ADMINUSERS = [
    {
      name: "Keisha Mukasa",
      email: "keisha.mukasa@gmail.com"
    },
    {
      name: "Luke Taylor",
      email: "luketaylor@notrealemail.com"
    }
  ];

export default function AdminManager({ blocked }) {
    return blocked ? <NotFound /> : (
        <div className={cx('base')}>
        {ADMINUSERS.map((user) => (
          <div className={cx('AdminUser')}>
            <input className={cx('AdminName')} type="text" value={user.name} />
            <input className={cx('AdminEmail')} type="text" value={user.email} />
          </div>
        ))}
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