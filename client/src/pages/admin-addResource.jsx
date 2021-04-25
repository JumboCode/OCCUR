import Reach from "react";
import {useForm} from "react-hook-form";
import { RESOURCE_CATEGORIES } from 'data/resources';

export default function addResource({ data }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);
  
  return (
    <div className="resourceForm">
      <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Add a Resource</h1>

          <h2>Resource Name *</h2>
          <input {...register("resourceName", {required: true}) } placeholder="Enter resource name" />
          
          <h2>Resource Organization *</h2>
          <input {...register("resourceOrg", {required: true}) } placeholder="Enter resource organization" />

          <h2>Category *</h2>
          <select {...register("resourceCategory", {required: true}) }>
            <option value="Wifi">Wifi</option>
            { RESOURCE_CATEGORIES.map((resource) => (
              <option value={resource.id}>{resource.label}</option>
            )) }
            /*PUT IN CATEGORIES*/
          </select>
          
          <h2>Date and Time *</h2>
          /* How to make it so that it's one or the other is required */
          <label>
            <input {...register("resourceTime")} type="checkbox" />
            One-time event
          </label>
          <label>
            <input {...register("resourceTime")} type="checkbox" />
            Recurring event
          </label>

          <h3>Day(s) of the Week</h3>
          <input {...register("resourceDay")} type="button" value = "M"></input>
          <input {...register("resourceDay")} type="button" value = "T"></input>
          <input {...register("resourceDay")} type="button" ></input>
          <input {...register("resourceDay")} type="button" ></input>
          <input {...register("resourceDay")} type="button" ></input>
          <input {...register("resourceDay")} type="button" ></input>
          <input {...register("resourceDay")} type="button" ></input>

          <h3>Start Time</h3>
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

          <h3>End Time</h3>
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

          <h2>Resouce Location *</h2>
          <label>
            <input {...register("resourceLocationV")} type="checkbox" />
            Virtual
          </label>
          <label>
            <input {...register("resourceLocationA")} type="checkbox" />
            Address
          </label>

          <h3>Virtual Meeting Link</h3>
          
          <input {...register("resourceVirtual") } placeholder="Enter meeting link" />
          <h3>Meeting Password (optional)</h3>
          <input {...register("resourceVirtual") } placeholder="Enter meeting password" />

          <h2>Resource Photo</h2>
          <input type="file"></input>

          <h2>Resource Description</h2>
          <textarea {...register("resourceDescription", {required: true}) } placeholder="Enter resource description" />
          
          <h2>External Link</h2>
          <input {...register("resourceLink") } placeholder="Enter link" />
        

      </form>

    
    </div>
  );
}
