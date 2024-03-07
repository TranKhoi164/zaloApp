import { useRecoilState, useRecoilValue } from "recoil"
import { accountState, accountAccessTokenState } from "../State"
import axios from 'axios'
import config from "../../config"
import AxiosJWT from "../utils/AxiosJWT"

export const AccountApi = () => {
  const account = useRecoilValue(accountState)
  const {REACT_APP_SERVER_URL} = config()
  const axiosJwt = AxiosJWT()

  const loginZaloProfileApi = (userInfor) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/login_zalo_profile', {
        zaloAccessToken: userInfor?.zaloAccessToken,
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

  const loginZaloPhoneNumberApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/login_zalo_phonenumber', {
        ...data
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

  const registerApi = (userInfor) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/register_with_email', {
        email: userInfor?.email,
        password: userInfor?.password,
        fullName: userInfor?.fullName,
      }).then(register_msg => {
        resolve(register_msg?.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }
  //get userId and otp
  const activeAccountOtpApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/active_account_with_otp', {
        userId: data?.userId,
        otp: data?.otp,
        task: data?.task
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
  // get userId and email, task
  const resendOtpApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/resend_otp', {
        email: data?.email,
        userId: data?.userId,
        task: data?.task
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

  const loginApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/login_with_email', {
        email: data?.email,
        password: data?.password
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

  // get email, return message, userId
  const sendResetPasswordEmailApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/send_reset_password_email', {
        email: data?.email,
      }).then(data => {
        resolve(data.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }
  // get otp, userId, password, task, return message
  const resetPasswordWithOtpApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/reset_password_with_otp', {
        otp: data?.otp,
        userId: data?.userId,
        password: data?.password,
        task: data?.task,
        // email: data?.email,
      }).then(data => {
        resolve(data.data)
      }).catch(e => {
        if (!e.response?.data?.message) {
          reject(e)
        }
        reject(e?.response?.data)
      })
    })
  }

  const getAccountInforApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.get(REACT_APP_SERVER_URL + '/account/account_infor/' + data?.accountId,
      ).then(data => {
        resolve(data?.data)
      }).catch(e => {
        reject(e)
        // if (!e.response?.data?.message) {
        //   reject(e)
        // }
        // reject(e?.response?.data)
      })
    })
  }
  //fullName, dateOfBirth
  const updateBasicApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.patch(REACT_APP_SERVER_URL + '/account/update_basic', 
        { ...data },
        { headers: {Authorization: account?.access_token}}
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
  //password, newPassword
  const updatePasswordApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.patch(REACT_APP_SERVER_URL + '/account/update_password', 
        { 
          password: data?.password,
          newPassword: data?.newPassword,
         },
        { headers: {Authorization: account.access_token}}
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

  const logoutApi = () => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/account/logout', 
        { headers: {Authorization: account.access_token}}
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
  //return message, avatar_url
  const updateAvatarApi = (formData) => {
    return new Promise((resolve, reject) => {
      axiosJwt.post(REACT_APP_SERVER_URL + '/upload/upload_avatar',
        formData,
        { headers: {"Content-Type": "multipart/form-data", Authorization: account.access_token}}
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

  const refreshAccessTokenApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.post(REACT_APP_SERVER_URL + '/account/refresh_access_token',
        {_id: data?._id}
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

  const refreshRefreshTokenApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.post(REACT_APP_SERVER_URL + '/account/refresh_refresh_token',
        {_id: data?._id}
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

  const partnerRegisterApi = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(REACT_APP_SERVER_URL + '/account/partner_register',
        {...data}
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
  //partner type(all, partner)
  const getAccountsInforApi = (query) => {
    return new Promise((resolve, reject) => {
      axios.get(REACT_APP_SERVER_URL + '/account/accounts_infor' + query,
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

  const getVerifiedPartnersApi = () => {
    return new Promise((resolve, reject) => {
      axios.get(REACT_APP_SERVER_URL + '/account/verified_partners',
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

  const getUnverifiedPartnersApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/account/unverified_partners',
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

  const verifyPartnerApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.patch(REACT_APP_SERVER_URL + '/account/verify_partner',
        {...data},
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

  const cancelVerificationPartnerApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.patch(REACT_APP_SERVER_URL + '/account/cancel_verification_partner',
        {...data},
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

  const deletePartnerApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt({
        url: REACT_APP_SERVER_URL + '/account/delete_partner',
        method:'delete',
        data : {...data},
        headers:{ Authorization: account.access_token}
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
  //user_id
  const getFavouritePartnersApi = (data) => {
    return new Promise((resolve, reject) => {
      axiosJwt.get(REACT_APP_SERVER_URL + '/account/favourite_partners/' + data?.user_id,
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

  return {
    loginZaloPhoneNumberApi: loginZaloPhoneNumberApi,
    loginZaloProfileApi: loginZaloProfileApi,
    registerApi: registerApi,
    activeAccountOtpApi: activeAccountOtpApi,
    resendOtpApi: resendOtpApi,
    loginApi: loginApi,
    sendResetPasswordEmailApi: sendResetPasswordEmailApi,
    resetPasswordWithOtpApi: resetPasswordWithOtpApi,
    getAccountInforApi: getAccountInforApi,
    updateBasicApi: updateBasicApi,
    updatePasswordApi: updatePasswordApi,
    logoutApi: logoutApi,
    updateAvatarApi: updateAvatarApi,
    refreshAccessTokenApi: refreshAccessTokenApi,
    refreshRefreshTokenApi: refreshRefreshTokenApi,
    partnerRegisterApi:partnerRegisterApi,
    getAccountsInforApi: getAccountsInforApi,
    getVerifiedPartnersApi: getVerifiedPartnersApi,
    getUnverifiedPartnersApi: getUnverifiedPartnersApi,
    verifyPartnerApi: verifyPartnerApi,
    cancelVerificationPartnerApi: cancelVerificationPartnerApi,
    deletePartnerApi: deletePartnerApi,
    getFavouritePartnersApi: getFavouritePartnersApi
  }
}