import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isAdmin } from 'auth';
import { useApi } from 'api';
import NotFound from 'pages/404';
import styles from './manager.module.scss';
import AddAdminModal from 'components/AddAdminModel';
import EditAdminModal from 'components/EditAdminModal';
import DeleteAdminModal from 'components/DeleteAdminModal';
import classNames from 'classnames/bind';
import Circleplus from '../../../public/icons/circle_plus.svg';
import Pen from '../../../public/icons/pencil.svg';
import Trash from '../../../public/icons/trash.svg';

const cx = classNames.bind(styles);

export default function AdminManager({ blocked }) {
  const api = useApi();
  const [adminsLoaded, setAdminsLoaded] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [openAddAdminModal, setopenAddAdminModal] = useState(false);
  const [openEditAdminModal, setopenEditAdminModal] = useState(false);
  const [openDeleteAdminModal, setopenDeleteAdminModal] = useState(false);
  const [userToEdit, setuserToEdit] = useState(null);
  const [userToDelete, setuserToDelete] = useState(null);

  const handleEditClick = (user) => {
    setopenEditAdminModal(true);
    setuserToEdit(user);
  };

  const handleDeleteClick = (user) => {
    setopenDeleteAdminModal(true);
    setuserToDelete(user);
  };

  const addUser = (data) => {
    api.post('admins', undefined, data)
      .then((responsePost) => {
        // console.log(responsePost);
        api.get('admins').then((responseGet) => {
          setAdmins(responseGet);
        }).catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const editUser = (currUser, data) => {
    const id = (currUser.user_id.split('|'))[1];
    api.put(`admins/${id}`, undefined, data)
      .then(() => {
        // console.log(responsePut);
        api.get('admins').then((responseGet) => {
          setAdmins(responseGet);
        }).catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteUser = (currUser) => {
    const id = (currUser.user_id.split('|'))[1];
    api.delete(`admins/${id}`)
      .then(() => {
        // console.log(responseDelete);
        api.get('admins').then((responseGet) => {
          setAdmins(responseGet);
        }).catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (api.authenticated) {
      api.get('admins').then((response) => {
        setAdmins(response);
        setAdminsLoaded(true);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [api, api.authenticated]);

  const adminList = () => {
    if (!adminsLoaded) {
      return <div>Loading admins...</div>;
    }
    return admins.map((user) => (
      <div className={cx('adminUser')} key={user.user_id}>
        <input className={cx('adminName')} type="text" readOnly value={user.name} />
        <div className={cx('verticalBreak')} />
        <input className={cx('adminEmail')} type="text" readOnly value={user.email} />
        <Pen className={cx('penIcon')} type="button" onClick={() => handleEditClick(user)} />
        <Trash className={cx('trashIcon')} type="button" onClick={() => handleDeleteClick(user)} />
      </div>
    ));
  };
  return blocked ? <NotFound /> : (
    <div className={cx('base')}>
      <AddAdminModal
        open={openAddAdminModal}
        close={setopenAddAdminModal}
        submit={addUser}
      />
      <EditAdminModal
        open={openEditAdminModal}
        close={setopenEditAdminModal}
        user={userToEdit}
        submit={editUser}
      />
      <DeleteAdminModal
        open={openDeleteAdminModal}
        close={setopenDeleteAdminModal}
        user={userToDelete}
        submit={deleteUser}
      />
      <div className={cx('mainAdminContainer')}>
        <div className={cx('buttonContainer')}>
          <button className={cx('addAdmin')} type="button" onClick={() => setopenAddAdminModal(true)}>
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
