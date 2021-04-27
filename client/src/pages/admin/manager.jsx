import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { isAdmin, useAuth } from 'auth';
import { useApi } from 'api';
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

export default function AdminManager({ blocked }) {
  const api = useApi();
  const [adminsLoaded, setAdminsLoaded] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const { register, handleSubmit } = useForm();

  function handleClick(type) {
    setModal(!modal);
    setModalType(type);
  }

  useEffect(() => {
    if (api.authenticated) {
      api.get('/list/admin').then((response) => {
        setAdmins(response);
        setAdminsLoaded(true);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [api.authenticated]);

  const onSubmit = (data) => console.log(data);
  // const onSubmit = (data) => {
  //   const newAdmin = {
  //     name: data.adminName,
  //     email: data.adminEmail,
  //   };
  //   if (api.authenticated) {
  //     api.post('/new/admin', undefined, newAdmin).then((response) => {
  //       console.log(response);
  //       // setAdmins(response);
  //       // setAdminsLoaded(true);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //     api.get('/list/admin').then((response) => {
  //       setAdmins(response);
  //       setAdminsLoaded(true);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //   }
  // };

  const Modal = () => {
    let title = '';
    if (modalType === 'add') {
      title = <h4>Add Admin</h4>;
    } else if (modalType === 'edit') {
      title = <h4>Edit Admin</h4>;
    }
    title = <h4>Delete Admin</h4>;

    return (
      <div className={cx('modalWindow')}>
        <form>
          <Close onClick={handleClick('')} className={cx('closeButton')} type="button" />
          { title }
          Admin Name
          <input name="adminName" {...register('adminName')} placeholder="Admin Name" />
          Admin Email
          <input name="adminEmail" {...register('adminEmail')} placeholder="Admin Email" />
          <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
          <button onClick={handleClick('')} className={cx('cancelButton')} type="button">Cancel</button>
        </form>
      </div>
    );
  };

  // const confirmDelete = (adminName) => {
  //   console.log('in confirm delete');
  //   return (
  //     <div className={cx('modalWindow')}>
  //       <form>
  //         <Close onClick={handleClick('')} className={cx('closeButton')} type="button"/>
  //         <h4>Delete Admin</h4>
  //         Are you sure you would like to delete
  //         {' '}
  //         { adminName }
  //         as an admin user?
  //       </form>
  //       <button onClick={handleClick('')} className={cx('saveButton')} type="button">Delete</button>
  //       <button onClick={handleClick('')} className={cx('cancelButton')} type="button">Cancel</button>
  //     </div>
  //   );
  // };

  const adminList = () => {
    if (!adminsLoaded) {
      return <div>Loading admins...</div>;
    }
    return admins.map((user) => (
      <div className={cx('adminUser')} key={user.user_id}>
        <input className={cx('adminName')} type="text" value={user.name} />
        <div className={cx('verticalBreak')} />
        <input className={cx('adminEmail')} type="text" value={user.email} />
        <Pen className={cx('penIcon')} />
        <Trash className={cx('trashIcon')} />
      </div>
    ));
  };

  return blocked ? <NotFound /> : (
    <div className={cx('base')}>
      {modal ? <Modal /> : null }
      <div className={cx('mainAdminContainer')}>
        <div className={cx('buttonContainer')}>
          <button className={cx('addAdmin')} type="button" onClick={handleClick('add')}>
            <Circleplus className={cx('circleIcon')} />
            <div
              className={cx('addAdminButton')}
            >
              Add Admin
            </div>
          </button>
        </div>
        <div className={cx('adminList')}>
          <h3 className={cx('adminListTitle')}>Admin List</h3>
          {adminList()}
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
