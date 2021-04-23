import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { isAdmin } from 'auth';
import NotFound from 'pages/404';
import styles from './manager.module.scss';

import classNames from 'classnames/bind';
import Circleplus from '../../../public/icons/circle_plus.svg';
import Pen from '../../../public/icons/pencil.svg';
import Trash from '../../../public/icons/trash.svg';
import Close from '../../../public/icons/close.svg';
// import { render } from 'sass';


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
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  let showModal = true;
  const closeModal = () => { console.log('In Close'); showModal = false; };
  const Modal = () => (
    <div className={cx('modalWindow')}>
      <form>
        <Close onClick={closeModal} className={cx('closeButton')} type="button"/>
        <h4>Add Admin</h4>
        Admin Name
        <input name="Admin Name" {...register('Admin Name')} placeholder="Admin Name" />
        Admin Email
        <input name="Admin Email" {...register('Admin Email')} placeholder="Admin Email" />
        <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={closeModal} className={cx('cancelButton')} type="button">Cancel</button>
      </form>
    </div>
  );

  return blocked ? <NotFound /> : (
    <div className={cx('base')}>
      {showModal ? <Modal /> : null }
      <div className={cx('mainAdminContainer')}>
        <div className={cx('buttonContainer')}>
          <div className={cx('addAdmin')}>
            <Circleplus className={cx('circleIcon')} />
            <button className={cx('addAdminButton')} type="button">Add Admin</button>
          </div>
        </div>
        <div className={cx('adminList')}>
          <h3 className={cx('adminListTitle')}>Admin List</h3>
          {ADMINUSERS.map((user) => (
            <div className={cx('adminUser')}>
              <input className={cx('adminName')} type="text" value={user.name} />
              <div className={cx('verticalBreak')} />
              <input className={cx('adminEmail')} type="text" value={user.email} />
              <Pen className={cx('penIcon')} />
              <Trash className={cx('trashIcon')} />
            </div>
          ))}
        </div>
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
