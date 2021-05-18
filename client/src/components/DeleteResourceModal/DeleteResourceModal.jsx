import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './DeleteResourceModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function DeleteResourceModal({ open, close, resourceID, submit }) {
  const { handleSubmit } = useForm();
  const onSubmit = () => {
    submit(resourceID);
    close(false);
  };
  return resourceID && (
    <Modal open={open} onClose={() => close(false)}>
      <form className={cx('deleteResourceForm')} onSubmit={handleSubmit(onSubmit)}>
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
        <h4>Delete Resource</h4>
        <div>Are you sure that you would like to delete this resource?</div>
        <div className={cx('buttonContainer')}>
          <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="button">Yes</button>
          <button onClick={() => close(false)} className={cx('cancelButton')} type="button">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

DeleteResourceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  resourceID: PropTypes.number,
  submit: PropTypes.func.isRequired,
};

DeleteResourceModal.defaultProps = {
  resourceID: null,
};
