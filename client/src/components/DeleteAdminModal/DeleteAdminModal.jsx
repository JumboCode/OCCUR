import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './DeleteAdminModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function DeleteAdminModal({ open, close, user, submit }) {
  const { handleSubmit } = useForm();
  const onSubmit = () => submit(user);
  // useEffect(() => {
  //   if (!user) {
  //     setValue('name', '');
  //     setValue('email', '');
  //   } else {
  //     setValue('name', user.name);
  //     setValue('email', user.email);
  //   }
  // }, [user]);
  return (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('deleteAdminForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Delete Admin</h4>
        <div>Are you sure that you would like to delete this admin?</div>
        <div className={cx('buttonContainer')}>
          <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Save</button>
          <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

DeleteAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
  }),
  submit: PropTypes.func.isRequired,
};

DeleteAdminModal.defaultProps = {
  user: null,
};
