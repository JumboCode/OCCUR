import React from "react";
import { useForm } from "react-hook-form";
import { RESOURCE_CATEGORIES, DAYS_OF_WEEK } from 'data/resources';
import Modal from 'components/Modal';
import styles from './admin-addResource.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

export default function AddResourceModal({ open, close, submit }) {
  const { register, handleSubmit, watch } = useForm();
  const onSubmit = (data) => {
    // console.log(data);
    submit(data);
    close(false);
  };

  const isRecurring = watch('recurring', false);
  const isVirtual = watch('virtual', false);

  return (
    <Modal className={styles.resourceForm} open={open} onClose={() => close(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Add a Resource</h1>

          <h2>Resource Name <span className={styles.required}>*</span></h2>
          <input {...register("resourceName", {required: true}) } placeholder="Enter resource name" />
          
          <h2>Resource Organization <span className={styles.required}>*</span></h2>
          <input {...register("resourceOrg", {required: true}) } placeholder="Enter resource organization" />

          <h2>Category <span className={styles.required}>*</span></h2>
          <select {...register("resourceCategory", { required: true }) } defaultValue="choose">
            <option disabled value="choose">Choose a category</option>
            { RESOURCE_CATEGORIES.map((cat) => (
              <option value={cat.id} key={cat.id}>{cat.label}</option>
            )) }
          </select>
          
          <h2>Date and Time <span className={styles.required}>*</span></h2>
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
              <h3>Day(s) of the Week <span className={styles.required}>*</span></h3>

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

          <h3>Start Date <span className={styles.required}>*</span></h3>
          <select {...register("startDate") }>
            <option value="sMonth">MM</option>
            <option value="sDay">dd</option>
            <option value="sYear">yyyy</option>
          </select>

          <h3>End Date <span className={styles.required}>*</span></h3>
          <select {...register("endDate") }>
            <option value="eMonth">MM</option>
            <option value="eDay">dd</option>
            <option value="eYear">yyyy</option>
          </select>

          <h3>Start Time <span className={styles.required}>*</span></h3>
          <select {...register("resourceTime") }>
            <option value="hour">--</option>
            <option value="hour">12</option>
          </select>

          <select {...register("resourceTime") }>
            <option value="minute">--</option>
            <option value="minute">00</option>
          </select>

          <select {...register("resourceTime") }>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <h3>End Time <span className={styles.required}>*</span></h3>
          <select {...register("resourceTime") }>
            <option value="hour">--</option>
            <option value="hour">12</option>
          </select>

          <select {...register("resourceTime") }>
            <option value="minute">--</option>
            <option value="minute">00</option>
          </select>

          <select {...register("resourceTime") }>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <h2>Resouce Location <span className={styles.required}>*</span></h2>
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
              <h3>Virtual Meeting Link <span className={styles.required}>*</span></h3>
          
              <input {...register("resourceVirtual") } placeholder="Enter meeting link" />
              <h3>Meeting Password (optional)</h3>
              <input {...register("resourceVirtual") } placeholder="Enter meeting password" />
            </>
          )}

          <h2>Resource Photo</h2>
          <input type="file"></input>

          <h2>Resource Description</h2>
          <textarea {...register("resourceDescription", {required: true}) } placeholder="Enter resource description" />
          
          <h2>External Link</h2>
          <input {...register("resourceLink") } placeholder="Enter link" />

          <div className={styles.cancelsavebutton}>
            <button onClick={() => close(false)} style={{ backgroundColor: 'rgb(155, 155, 155)' }}>Cancel</button>
            <button onClick={handleSubmit(onSubmit)} type="submit">Save</button>
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
