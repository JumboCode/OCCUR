import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './AddAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AddAdminModal({ open, close, submit, errorMessage, setErrorMessage }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    submit(data).then((result) => {
      console.log(result);
      if (result){
        close(false);
        setErrorMessage(null)
      }
    });
  };

  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('addAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => {close(false); setErrorMessage(null);}} className={cx('closeButton')} type="button" />
        <h4>Add Admin</h4>
        <div className={cx('error', { hidden: !errorMessage })}>
          {errorMessage}
        </div>
        <div className={cx('input-group')}>
          Admin Name
          <input name="name" {...register('name')} placeholder="Admin Name" />
          Admin Email
          <input name="email" {...register('email')} placeholder="Admin Email" />
        </div>
        <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={() => {close(false); setErrorMessage(null);}} className={cx('cancelButton')} type="button">Cancel</button>
      </form>
    </Modal>
  );
}

AddAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
};

AddAdminModal.defaultProps = {
  errorMessage: null,
  setErrorMessage: null,
};
