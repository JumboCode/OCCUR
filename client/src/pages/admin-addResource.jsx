import React from "react";
import { useForm } from "react-hook-form";
import { RESOURCE_CATEGORIES, DAYS_OF_WEEK } from 'data/resources';
import Modal from 'components/Modal';
import styles from './admin-addResource.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Close from '../../public/icons/close.svg';

const cx = classNames.bind(styles);

export default function AddResourceModal({ open, close, submit }) {
  const { register, handleSubmit, watch } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    submit(data);
    close(false);
  };

  const isRecurring = watch('recurring', false);
  const isVirtual = watch('virtual', false);

  return (
    <Modal className={styles.resourceForm} open={open} onClose={() => close(false)}>
      <form onSubmit={handleSubmit(onSubmit)} >
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
          <h1>Add a Resource</h1>

          <h2 className={styles.fieldTitle}>Resource Name <span className={styles.required}>*</span></h2>
          <input className={styles.resourceInput} {...register("resourceName", {required: true}) } placeholder="Enter resource name" />
          
          <h2 className={styles.fieldTitle}>Resource Organization <span className={styles.required}>*</span></h2>
          <input className={styles.resourceInput} {...register("resourceOrg", {required: true}) } placeholder="Enter resource organization" />

          <h2 className={styles.fieldTitle}>Category <span className={styles.required}>*</span></h2>
          <select className={styles.resourceInput} {...register("resourceCategory", { required: true }) } defaultValue="choose">
            <option disabled value="choose">Choose a category</option>
            { RESOURCE_CATEGORIES.map((cat) => (
              <option value={cat.id} key={cat.id}>{cat.label}</option>
            )) }
          </select>
          
          <h2 className={styles.fieldTitle}>Date and Time <span className={styles.required}>*</span></h2>
          <div id="radioButton">
            <label>
              <input {...register("recurring", { required: true })} value="one-time" type="radio" />
              One-time event
            </label>
            <label>
              <input {...register("recurring", { required: true })} value="recurring" type="radio" />
              Recurring event
            </label>
          </div>

          {isRecurring === 'recurring' && (
            <>
              <h2 className={styles.fieldTitle}> Day(s) of the Week <span className={styles.required}>*</span></h2>

              <div className={styles.daysWrapper}>
                { DAYS_OF_WEEK.map((day) => (
                  <label key={day.id} className={styles.dayOfWeek}>
                    <input {...register("resourceDay")} type="checkbox" value={day.id} />
                    <div>{day.shortLabel}</div>
                  </label>
                )) }
              </div>
            </>
          )}

          <h2 className={styles.fieldTitle}>Start Date <span className={styles.required}>*</span></h2>
          <input type="date" {...register("startDate") }>
          </input>

          <h2 className={styles.fieldTitle}>End Date <span className={styles.required}>*</span></h2>
          <input type="date" {...register("endDate") }>
          </input>

          <h2 className={styles.fieldTitle}>Start Time <span className={styles.required}>*</span></h2>
          <input type="time" {...register("startTime") }>
            {/* <option value="hour">--</option>
            <option value="hour">12</option> */}
          </input>


          <h2 className={styles.fieldTitle}>End Time <span className={styles.required}>*</span></h2>
          <input type="time" {...register("endTime") }>
            {/* <option value="minute">--</option>
            <option value="minute">00</option> */}
          </input>

          <h2 className={styles.fieldTitle}>Resource Location <span className={styles.required}>*</span></h2>
          <label>
            <input {...register("virtual", { required: true })} value= 'virtual' type="radio" />
            Virtual
          </label>
          <label>
            <input {...register("virtual", { required: true })} value = 'address' type="radio" />
            Address
          </label>

          {isVirtual === 'virtual' && (
            <>
              <h2 className={styles.fieldTitle}>Virtual Meeting Link <span className={styles.required}>*</span></h2>
          
              <input className={styles.resourceInput} {...register("resourceVirtual") } placeholder="Enter meeting link" />
              <h2 className={styles.fieldTitle}>Meeting Password (optional)</h2>
              <input className={styles.resourceInput} {...register("resourceVirtual") } placeholder="Enter meeting password" />
            </>
          )}
          {isVirtual === 'address' && (
            <>
              <h2 className={styles.fieldTitle}>Street Address<span className={styles.required}>*</span></h2>
              <input className={styles.resourceInput} {...register("street_address", {required: true}) } placeholder="Enter address" />
              <div className={styles.outerDiv}>
                <div className={styles.innerDiv}>
                  <h2 className={styles.fieldTitle}>City<span className={styles.required}>*</span></h2>
                  <input {...register("city", {required: true}) } placeholder="Enter city" />
                </div>
                <div className={styles.innerDiv}>
                  <h2 className={styles.fieldTitle}>State<span className={styles.required}>*</span></h2>
                  <input {...register("state", {required: true}) } placeholder="Enter state" />
                </div>
              </div> 
              <h2 className={styles.fieldTitle}>Zip Code<span className={styles.required}>*</span></h2>
              <input {...register("zip_code", {required: true}) } placeholder="Enter zip code" />
            </>
          )}
          <h2 className={styles.fieldTitle}>Resource Photo</h2>
          <input type="file" name="Upload resource photo"></input>
          <label></label>

          <h2 className={styles.fieldTitle}>Resource Description</h2>
          <textarea className= {styles.resourceInput} {...register("resourceDescription", {required: true}) } placeholder="Enter resource description" />
          
          <h2 className={styles.fieldTitle}>External Link</h2>
          <input className={styles.resourceInput} {...register("resourceLink") } placeholder="Enter link" />

          <div className={styles.cancelsavebutton}>
            <button onClick={() => close(false)} className={cx('cancelButton')}>Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="submit">Save</button>
          </div>
      </form>
    </Modal>
  );
}

AddResourceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};
