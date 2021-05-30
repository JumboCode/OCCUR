import React from "react";
import { useForm } from "react-hook-form";
import { RESOURCE_CATEGORIES, DAYS_OF_WEEK } from 'data/resources';
import Modal from 'components/Modal';
import styles from './EditResourceModal.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Close from '../../../public/icons/close.svg';
import { fill } from "lodash";

const cx = classNames.bind(styles);

export default function EditResourceModal({ open, close, errorMessage, resource, submit }) {
  let fillResource = resource;
  fillResource.flyer = ""
  const { register, handleSubmit, watch } = useForm({
    defaultValues: fillResource
  });
  var b64flyer;
  async function onSubmit  (data)  {
    var recurringDayList = [];
    var startTime = null;
    var endTime = null;
    console.log(data.flyer)
    if(data.recurrenceDays){
      recurringDayList = data.recurrenceDays;
    }    
    if(data.startTime){
      startTime = data.startTime.concat(':00');
    }    
    if(data.endTime){
      endTime = data.endTime.concat(':00');
    }
    var newResource = {
      "name": data.name,
      "organization": data.organization,
      "category": data.category,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "startTime": startTime,
      "endTime": endTime,
      "isRecurring": data.isRecurring,
      "recurrenceDays": recurringDayList,
      "flyer": b64flyer,
      "flyerId": data.flyerId,
      "link": data.link,
      "meetingLink": data.meetingLink,
      "phone": data.phone,
      "email": data.email,
      "description": data.description
    }
    if (data.street_address && data.city && data.state){
      const location = {
        "location_title" : data.location_title,
        "street_address": data.street_address,
        "city" : data.city,
        "state": data.state,
        "zip_code": data.zip_code
      }
      newResource = Object.assign(newResource, {"location": location});
    }
    console.log(JSON.stringify(newResource));
    // const newResourceJson = JSON.stringify(newResource);
    // console.log(newResourceJson);
   await submit(newResource).then((result) => {
      console.log(result);
      if (result){
        close(false);
      }
    });
  };

  const handleFlyerSelected = (e) => {
    console.log("heres the flyer", e.target.files[0])
    let flyer = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(flyer);
    reader.onloadend = () => {
      console.log(reader.result)
      b64flyer = reader.result;
    }  
  };

  const isRecurring = watch('isRecurring', false);

  return (
    <Modal className={styles.resourceForm} open={open} onClose={() => close(false)}>
      <form onSubmit={handleSubmit(onSubmit)} >
        <Close onClick={() => close(false)} className={cx('closeButton')} type="button" />
          <h1>Edit this Resource</h1>
          <h2 className={styles.fieldTitle}>Resource Name <span className={styles.required}>*</span></h2>
          <input className={styles.resourceInput} {...register("name", {required: true}) } placeholder="Enter resource name" />
          
          <h2 className={styles.fieldTitle}>Resource Organization <span className={styles.required}>*</span></h2>
          <input className={styles.resourceInput} {...register("organization", {required: true}) } placeholder="Enter resource organization" />

          <h2 className={styles.fieldTitle}>Category <span className={styles.required}>*</span></h2>
          <select className={styles.resourceInput} {...register("category", { required: true }) } defaultValue="choose">
            <option disabled value="choose">Choose a category</option>
            { RESOURCE_CATEGORIES.map((cat) => (
              <option value={cat.id} key={cat.id}>{cat.label}</option>
            )) }
          </select>
          
          <h2 className={styles.fieldTitle}>Date and Time </h2>
          <div id="radioButton">
            <label>
              <input {...register("isRecurring")} value="false" type="radio" />
              One-time event
            </label>
            <label>
              <input {...register("isRecurring")} value="true" type="radio" />
              Recurring event
            </label>
          </div>
          {isRecurring === "true" && (
            <>
              <h2 className={styles.fieldTitle}> Day(s) of the Week </h2>

              <div className={styles.daysWrapper}>
                { DAYS_OF_WEEK.map((day) => (
                  <label key={day.id} className={styles.dayOfWeek}>
                    <input {...register("recurrenceDays")} type="checkbox" value={day.id} />
                    <div>{day.shortLabel}</div>
                  </label>
                )) }
              </div>
            </>
          )}

          <h2 className={styles.fieldTitle}>Start Date </h2>
          <input type="date" {...register("startDate") }>
          </input>

          <h2 className={styles.fieldTitle}>End Date </h2>
          <input type="date" {...register("endDate") }>
          </input>

          <h2 className={styles.fieldTitle}>Start Time </h2>
          <input type="time" {...register("startTime") }>
            {/* <option value="hour">--</option>
            <option value="hour">12</option> */}
          </input>


          <h2 className={styles.fieldTitle}>End Time </h2>
          <input type="time" {...register("endTime") }>
            {/* <option value="minute">--</option>
            <option value="minute">00</option> */}
          </input>
          <>
            <h2 className={styles.fieldTitle}>Virtual Meeting Link </h2>
            <input className={styles.resourceInput} {...register("meetingLink") } placeholder="Enter meeting link" />
          </>
          <>
            <h2 className={styles.fieldTitle}>Location Name</h2>
            <input className={styles.resourceInput} {...register("location_title")} placeholder="Enter location name" />
            <h2 className={styles.fieldTitle}>Street Address</h2>
            <input className={styles.resourceInput} {...register("street_address")} placeholder="Enter address" />
            <div className={styles.outerDiv}>
              <div className={styles.innerDiv}>
                <h2 className={styles.fieldTitle}>City</h2>
                <input {...register("city")} placeholder="Enter city" />
              </div>
              <div className={styles.innerDiv}>
                <h2 className={styles.fieldTitle}>State</h2>
                <input {...register("state")} placeholder="Enter state" />
              </div>
            </div> 
            <h2 className={styles.fieldTitle}>Zip Code</h2>
            <input {...register("zip_code")} placeholder="Enter zip code" />
          </>
          <h2 className={styles.fieldTitle}>Resource Photo</h2>
          <input type="file" {...register("flyer") } placeholder="Upload resource photo" 
          name="resource photo" onChange={handleFlyerSelected}></input>
          <label></label>

          <h2 className={styles.fieldTitle}>Resource Description<span className={styles.required}>*</span></h2>
          <textarea className= {styles.resourceInput} {...register("description", {required: true}) } placeholder="Enter resource description" />
          
          <h2 className={styles.fieldTitle}>External Link</h2>
          <input className={styles.resourceInput} {...register("link") } placeholder="Enter link" />
          
          <h2 className={styles.fieldTitle}>Phone number</h2>
          <input className={styles.resourceInput} {...register("phone") } placeholder="Enter contact phone number" />
          
          <h2 className={styles.fieldTitle}>Email address</h2>
          <input className={styles.resourceInput} {...register("email") } placeholder="Enter contact email address" />
          <div className={cx('error', { hidden: !errorMessage })}>
          {errorMessage}
          </div>
          <div className={styles.cancelsavebutton}>
            <button onClick={() => close(false)} className={cx('cancelButton')}>Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className={cx('saveButton')} type="submit">Save</button>
          </div>
      </form>
    </Modal>
  );
}

EditResourceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  submit: PropTypes.func.isRequired,
};