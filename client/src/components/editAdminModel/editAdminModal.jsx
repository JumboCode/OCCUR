import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './editAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function editAdminModal({ open, close }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  const user = {
    name: 'Keisha',
    email: 'keisha.mukasa@gmail.com',
  };

  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('editAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Edit Admin</h4>
        Admin Name
        <input name="adminName" {...register('adminName')} value={user.name} onChange={(e) => { user.name = e; }} />
        Admin Email
        <input name="adminEmail" {...register('adminEmail')} value={user.email} onChange={(e) => { user.email = e; }} />
        <button onClick={() => close(false)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
      </form>
    </Modal>
  );
}

editAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
