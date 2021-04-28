import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './AddAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AddAdminModal({ open, close }) {
  // const [openAdminModal, setopenAdminModal] = useState(open);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className={cx('mainAddAdminModal')}>
      <Modal open={open} onClose={() => close(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
          <h4>Add Admin</h4>
          Admin Name
          <input name="adminName" {...register('adminName')} placeholder="Admin Name" />
          Admin Email
          <input name="adminEmail" {...register('adminEmail')} placeholder="Admin Email" />
          <button onClick={() => close(false)} className={cx('saveButton')} type="button">Save</button>
          <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

AddAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
