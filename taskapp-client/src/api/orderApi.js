import { useRecoilState, useRecoilValue } from "recoil"
import { accountState, accountAccessTokenState } from "../State"
import axios from 'axios'
import config from "../../config"
import AxiosJWT from "../utils/AxiosJWT"

export const OrderApi = () => {
  const account = useRecoilValue(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJwt = AxiosJWT()

  //create services
  const createOrderApi = (obj) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/order/create_order', {
        ...obj
      }).then(data => {
        resolve(data?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }
  
  const getOrdersApi = (query) => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/order/get_orders' + query, {
        headers: {Authorization: account?.access_token}
      })
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
  const deleteOrderApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.delete(REACT_APP_SERVER_URL + '/order/delete_order/'+data?.order_id,
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
  const updateOrderApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.patch(REACT_APP_SERVER_URL + '/order/update_order', 
        { ...data }, 
        { headers: {Authorization: account?.access_token} }
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

  return {
    getOrdersApi: getOrdersApi,
    createOrderApi: createOrderApi,
    updateOrderApi: updateOrderApi,
    deleteOrderApi: deleteOrderApi
  }
}