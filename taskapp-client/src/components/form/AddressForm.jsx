import React, {useState, useEffect} from "react";
import { AddressApi } from "../../api/addressApi";

function AddressForm({ location, setLocation }) {
  const { getProvincesApi } = AddressApi(); //, getDistrictsApi, getWardsApi
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const getProvinces = async () => {
    getProvincesApi()
      .then((provinces) => setProvinces(provinces))
      .catch((e) => console.log(e.message));
  };

  const changeProvince = async (e) => {
    const { name, value } = e.target;
    const provinceData = JSON.parse(value);

    setLocation({ ...location, [name]: provinceData?.Name, district: '', ward: '' });

    const districts = provinces.filter(pro => pro?.Id == provinceData?.Id)
    setDistricts(districts[0]?.Districts)
  };

  const changeDistrict = async (e) => {
    const { name, value } = e.target;
    const districtData = JSON.parse(value);

    setLocation({ ...location, [name]: districtData?.Name, ward: '' });

    const wards = districts?.filter(dis => dis?.Id == districtData?.Id)
    setWards(wards[0]?.Wards)
  };

  const changeWard = (e) => {
    setLocation({ ...location, ward: e.target.value });
  };

  useEffect(() => {
    getProvinces()
  }, []);



  return (
    <div className="flex justify-between">
      <select name="province" onChange={changeProvince} className="select-1">
        <option value="" disabled selected={!location?.province && 'selected'}>
          Tỉnh...
        </option>
        {provinces?.map((province) => {
          return (
            <option
              key={province?.Id}
              value={`{"Name":"${province?.Name}","Id":"${province?.Id}"}`}
            >
              {province?.Name}
            </option>
          );
        })}
      </select>

      <select name="district" onChange={changeDistrict} className="select-1">
        <option value="" disabled selected={!location?.district && 'selected'}>
          Huyện...
        </option>
        {districts?.map((district) => {
          return (
            <option
              key={district?.Id}
              value={`{"Name":"${district?.Name}","Id":"${district?.Id}"}`}
            >
              {district?.Name}
            </option>
          );
        })}
      </select>

      <select name="ward" onChange={changeWard} className="select-1">
        <option value="" disabled selected={!location?.ward && 'selected'}>
          Xã, phường...
        </option>
        {wards?.map((ward) => {
          return (
            <option key={ward?.Id} value={wards?.Name}>
              {ward?.Name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default AddressForm;
