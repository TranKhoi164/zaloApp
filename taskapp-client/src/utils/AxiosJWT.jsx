import axios from "axios";
import jwt_decode from 'jwt-decode' 
import { useRecoilState } from 'recoil'
import { accountState } from '../State'
import config from "../../config"
import { AccountApi } from "../api/accountApi";

function AxiosJWT() {
  const [accountData, setAccountData] = useRecoilState(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJWT = axios.create()

  // TODO: when client request to server, axiosJWT will check if token expires then request a new one
  axiosJWT.interceptors.request.use(async (config) => {
    const date = new Date()
    const decodedToken = jwt_decode(accountData?.access_token || accountData?.access_token?.data?.access_token)
    //if token is expired
    if (decodedToken?.exp < date.getTime()/1000) {
      try {
        const access_token = await axios.post(REACT_APP_SERVER_URL + '/account/refresh_access_token', 
          {_id: accountData._id}
        )
        setAccountData({
          ...accountData,
          access_token: access_token.data?.access_token
        })
        config.headers["Authorization"] = access_token.data?.access_token
      } catch (e) {
        const access_token = await axios.post(REACT_APP_SERVER_URL + '/account/refresh_refresh_token', 
          {_id: accountData._id}
        )
        setAccountData({
          ...accountData,
          access_token: access_token.data?.access_token
        })
        config.headers["Authorization"] = access_token.data?.access_token
      }
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  return axiosJWT
}

export default AxiosJWT