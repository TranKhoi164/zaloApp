import React, { useState, useEffect, useRef } from "react";
import { ServiceApi } from "../../api/serviceApi";

function ServiceForm({ services, selectedServices, setSelectedServices }) {
  const { getServicesApi } = ServiceApi();
  const [allServices, setAllServices] = useState([]);
  const checkedServices = useRef([])

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedServices([...selectedServices, value])
    } else {
      const newCheckedServices = selectedServices?.filter(service => service!=value)
      setSelectedServices([...newCheckedServices])
    }
  };

  console.log('selectedService: ', selectedServices);



  const checkService = (value) => {
    if (selectedServices?.includes(value)) {
      return true
    } else return false
  }
  return (
    <div>
      {services?.map((service) => {
        return <div key={service?._id}>
          <input className="checkbox-1" type="checkbox" id={service?._id} name='services' checked={checkService(service?._id) ? 'checked':''} onChange={handleCheckboxChange} value={service?._id} />
          <label for={service?._id}>{service?.name}</label>
        </div>
      })}
    </div>
  );
}

export default ServiceForm;
