import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './AddAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AddAdminModal({ open, close, submit }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // console.log(data);
    submit(data);
    close(false);
  };

  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('addAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Add Admin</h4>
        Admin Name
        <input name="name" {...register('name')} placeholder="Admin Name" />
        Admin Email
        <input name="email" {...register('email')} placeholder="Admin Email" />
        <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
      </form>
    </Modal>
  );
}

AddAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};
