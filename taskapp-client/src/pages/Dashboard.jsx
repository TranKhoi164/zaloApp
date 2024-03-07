import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Spinner, useNavigate, useSnackbar } from 'zmp-ui'
import { accountState } from '../State'
import { AccountApi } from '../api/accountApi'
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis'


function Dashboard() {
  const [account, setAccount] = useRecoilState(accountState)
  const navigate = useNavigate()
  const {openSnackbar} = useSnackbar()
  const {logoutApi, loginZaloPhoneNumberApi, getAccountInforApi} = AccountApi()
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    if (account?.role == 'partner') {
      getAccountInfor()
    }
  }, [])

  const getAccountInfor = () => {
    getAccountInforApi({accountId: account?._id})
    .then(data => {
      setAccount({access_token: account?.access_token, ...data?.account})
    }).catch(e => {
      throw new Error(e)
    })
  }

  const triggerLogout = () => {
    logoutApi()
    .then(data => {
      openSnackbar({
        text: data?.message,
        type: "success",
      });
      setAccount({})
      setLoadingLogout(false)
    }).then(() => {
      navigate('/')
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: "error",
      });
      setLoadingLogout(false)
    })
  }

  const loginZaloPhoneNumber = async () => {
    try {
      setLoginLoading(true)
      const zaloAccessToken = await getAccessToken({})
      const phoneNumberToken = await getPhoneNumber({})
      loginZaloPhoneNumberApi({zaloAccessToken: zaloAccessToken, phoneNumberToken: phoneNumberToken?.token})
      .then(data => {
        setLoginLoading(false)
        setAccount({...data?.account})
      }).catch(e => {
        useSnackbar({
          type: 'error',
          text: e?.message
        })
      })
    } catch (e) {
      openSnackbar({
        text: e.message,
        type: 'error'
      })
    }
  }

  return (
    <div className='container-1 h-[100vh] items-center'>
      {Object.keys(account)?.length == 0 
      && <div className='box-1 bg-transparent'>
        {loginLoading 
        ? <div className='flex justify-center'><Spinner /></div>
        : <button onClick={loginZaloPhoneNumber} className='btn-1 w-[50%] rounded-lg mb-[20px] mt-[20px]'>ĐĂNG NHẬP</button>}
      </div>  }
    
      <div className='box-1 mt-[5px] text-1' onClick={() => {
          if (Object.keys(account).length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/profile')
        }}>
        Cá nhân
      </div>
      {account?.role === 'partner' && <>
        <div className='box-1 mt-[5px] text-1' onClick={() => {
          if (Object.keys(account).length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/partner/partner_profile')
        }}>
          Quản lý profile
        </div>
      </>}
      {account?.role === 'admin' && <>
        <div className='box-1 mt-[5px] text-1' onClick={() => {
          if (Object.keys(account)?.length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/service_management')
        }}>
          Quản lý dịch vụ
        </div>
        <div className='box-1 mt-[5px] text-1' onClick={() => {
          if (Object.keys(account)?.length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/verified_partners')
        }}>
          Quản lý đơn vị
        </div>
      </>}
      <div className='box-1 mt-[5px] text-1' onClick={() => {
        if (Object.keys(account).length == 0) {
          loginZaloPhoneNumber()
          return
        }
        navigate('/my_orders/user')
      }}>
        Đơn hàng của tôi
      </div>
      <div className='box-1 mt-[5px] text-1' onClick={() => {
        if (Object.keys(account).length == 0) {
          loginZaloPhoneNumber()
          return
        }
        navigate('/favourite_partners')
      }}>
        Đơn vị yêu thích
      </div>
      {!loadingLogout ? <button className='box-1 text-1 mt-[5px] mb-[90px]' onClick={triggerLogout}>Đăng xuất</button>
      : <Spinner />}
    </div>
  )
}

export default Dashboard