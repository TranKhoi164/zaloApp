import { useRecoilState, useRecoilValue } from "recoil"
import { accountState, accountAccessTokenState } from "../State"
import axios from 'axios'
import config from "../../config"
import AxiosJWT from "../utils/AxiosJWT"

export const NotificationApi = () => {
  const account = useRecoilValue(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJwt = AxiosJWT()
  //take notification_id
  const getNotificationApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/notification/get_notification/'+data?.notification_id, {
        headers: {Authorization: account?.access_token}
      })
      .then(data => {
        resolve(data?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.respons?.data)
      })
    })
  }
  
  // query string, get page, role of receiver
  const getNotificationsApi = (query) => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/notification/get_notifications/'+query,{
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
  //title, body, sender, roleOfReceiver, to
  const createNotificationApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/notification/create_notification',
        {...data},
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
  //  {ids: [{},{}]} isSeen
  const updateNotificationsApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/notification/update_notifications',
        {...data},
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
    getNotificationApi: getNotificationApi,
    getNotificationsApi: getNotificationsApi,
    createNotificationApi: createNotificationApi,
    updateNotificationsApi: updateNotificationsApi
  }
}