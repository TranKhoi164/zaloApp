import { useRecoilState, useRecoilValue } from "recoil"
import { accountState, accountAccessTokenState } from "../State"
import axios from 'axios'
import config from "../../config"
import AxiosJWT from "../utils/AxiosJWT"

export const ServiceApi = () => {
  const account = useRecoilValue(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJwt = AxiosJWT()
  
  //get services
  const getServicesApi = () => {
    return new Promise((resolve, reject) => {
      axios.get(REACT_APP_SERVER_URL + '/service/get_services')
      .then(data => {
        resolve(data?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }
  //arg: name
  const createServiceApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.post(REACT_APP_SERVER_URL + '/service/create_service',
        {...data},
        { headers: {Authorization: account.access_token} }
      ).then(data => {
        resolve(data?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  //arg: serviceId
  const deleteServiceApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt({
        url: REACT_APP_SERVER_URL + '/service/delete_service',
        method:'delete',
        data : {...data},
        headers:{ Authorization: account?.access_token}
      }).then(deleteMessage => {
        resolve(deleteMessage?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  //arg: servicesId
  const deleteServicesApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt({
        url: REACT_APP_SERVER_URL + '/service/delete_services',
        method:'delete',
        data : {...data},
        headers:{ Authorization: account?.access_token}
      }).then(deleteMessage => {
        resolve(deleteMessage?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  return {
    getServicesApi: getServicesApi,
    createServiceApi: createServiceApi,
    deleteServiceApi: deleteServiceApi,
    deleteServicesApi: deleteServicesApi
  }
}