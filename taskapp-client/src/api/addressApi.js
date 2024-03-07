import axios from "axios"
import config from "../../config"


// const provinces_api_url = 'https://provinces.open-api.vn/api'
const provinces_api_url = 'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'

export const AddressApi = () => {
  const {REACT_APP_SERVER_URL} = config()
  let Parameter

  const getProvincesApi = () => {
    return new Promise((resolve, reject) => {
      axios.get(provinces_api_url,
      ).then(provinces => {
        // Parameter = provinces?.data
        resolve(provinces?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  const getDistrictsApi = async (provinceId) => {
    console.log(provinceId);
    // return new Promise((resolve, reject) => {
    //   axios.get(provinces_api_url+'/p/'+province_code+'?depth=2', 
    //   ).then(districts => {
    //     resolve(districts.data)
    //   }).catch(e => {
    //     if (!e.response?.data?.message) {
    //       reject(e)
    //     }
    //     reject(e?.response?.data)
    //   })
    // })
    // return new Promise((resolve, reject) => {
    //   let districts = Parameter.filter(pro => pro?.Id == provinceId)?.Districts
    //   resolve(districts)
    // })
    return new Promise((resolve, reject) => {
      axios.get(provinces_api_url,
      ).then(provinces => {
        // Parameter = provinces?.data
        const district = provinces.filter(pro => pro?.Id == provinceId)
        resolve(district?.Districts)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
    // let districts = await Parameter?.filter(pro => pro?.Id == provinceId)
    // console.log(Parameter);
    // return districts?.Districts
  }

  const getWardsApi = (district_code) => {
    return new Promise((resolve, reject) => {
      axios.get(provinces_api_url+'/d/'+district_code+'?depth=2', 
      ).then(wards => {
        resolve(wards.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  const createAddressApi = (data) => {

    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/address/create_address',
        {...data},
      ).then(data => {
        resolve(data.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  const deleteAddressApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.delete(REACT_APP_SERVER_URL + '/address/delete_address/'+data?.addressId,
      ).then(data => {
        resolve(data.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  const createAddressesApi = (data) => {

    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/address/create_addresses',
        {...data},
      ).then(data => {
        resolve(data.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }


  return {
    createAddressApi: createAddressApi,
    createAddressesApi: createAddressesApi,
    deleteAddressApi: deleteAddressApi,
    getProvincesApi: getProvincesApi,
    getDistrictsApi: getDistrictsApi,
    getWardsApi: getWardsApi
  }
}