import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './EditAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function EditAdminModal({ open, close, user, submit, errorMessage, setErrorMessage }) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (!user) {
      setValue('name', '');
      setValue('email', '');
    } else {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user]);

  const onSubmit = (data) => {
    submit(user, data).then((result) => {
      console.log(result);
      if (result) {
        close(false);
        setErrorMessage(null);
      }
    });
  };

  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('editAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => { close(false); setErrorMessage(null); }} className={cx('closeButton')} type="button" />
        <h4>Edit Admin</h4>
        <div className={cx('error', { hidden: !errorMessage })}>
          {errorMessage}
        </div>
        <div className={cx('input-group')}>
          Admin Name
          <input name="name" {...register('name')} />
          Admin Email
          <input name="email" {...register('email')} />
          <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
          <button onClick={() => { close(false); setErrorMessage(null); }} className={cx('cancelButton')} type="button">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

EditAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
  }),
  submit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func
};

EditAdminModal.defaultProps = {
  user: null,
  errorMessage: null,
  setErrorMessage: null
};
