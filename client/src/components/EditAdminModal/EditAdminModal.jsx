import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './EditAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function EditAdminModal({ open, close, user, submit }) {
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

  const onSubmit = (data) => submit(user, data);

  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('editAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Edit Admin</h4>
        Admin Name
        <input name="name" {...register('name')} />
        Admin Email
        <input name="email" {...register('email')} />
        <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
        <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
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
};

EditAdminModal.defaultProps = {
  user: null,
};
