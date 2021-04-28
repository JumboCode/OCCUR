import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './DeleteAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function DeleteAdminModal({ open, close }) {
  const user = {
    name: 'Keisha',
    email: 'keisha.mukasa@gmail.com',
  };
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('deleteAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Delete Admin</h4>
        Are you sure you want to delete admin
        {' '}
        {user.email}
        {' '}
        ?
        <button onClick={() => close(false)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
      </form>
    </Modal>
  );
}

DeleteAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
