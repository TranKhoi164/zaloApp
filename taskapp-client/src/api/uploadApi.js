import { useRecoilState, useRecoilValue } from "recoil"
import { accountState, accountAccessTokenState } from "../State"
import axios from 'axios'
import config from "../../config"
import AxiosJWT from "../utils/AxiosJWT"

export const UploadApi = () => {
  const account = useRecoilValue(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJwt = AxiosJWT()
  

  const uploadImageBase64Api = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.post(REACT_APP_SERVER_URL + '/upload/upload_image_base64',
        data,
        { headers: {Authorization: account.access_token}}
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

  const deleteImageApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt({
        url: REACT_APP_SERVER_URL + '/upload/delete_image',
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
    uploadImageBase64Api: uploadImageBase64Api,
    deleteImageApi: deleteImageApi
  }
}