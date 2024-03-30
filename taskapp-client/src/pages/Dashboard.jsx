import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Icon, Spinner, useNavigate, useSnackbar } from 'zmp-ui'
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
    <div className='cover-2'>
      <div className='header-text-2'>Dashboard</div>
      <div className='container-3'>
        {Object.keys(account)?.length == 0 
        && <div className='box-1 bg-transparent'>
          {loginLoading 
          ? <div className='flex justify-center'><Spinner /></div>
          : <button onClick={loginZaloPhoneNumber} className='container-1 btn-5 w-[50%] rounded-lg mb-[1vh]'>ĐĂNG NHẬP</button>}
        </div>  }
      
        <div className='article-2 box-shadow-2 text-1' onClick={() => {
            if (Object.keys(account).length == 0) {
              loginZaloPhoneNumber()
              return
            }
            navigate('/profile')
          }}>
          <div className='ml-[15px]'>Cá nhân</div>
          <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
        </div>


        {account?.role === 'partner' && <>
          <div className='article-2 box-shadow-2 text-1' onClick={() => {
            if (Object.keys(account).length == 0) {
              loginZaloPhoneNumber()
              return
            }
            navigate('/partner/partner_profile')
          }}>
            <div className='ml-[15px]'>Quản lý profile</div>
            <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
          </div>
        </>}
        {account?.role === 'admin' && <>
          <div className='article-2 box-shadow-2 text-1' onClick={() => {
            if (Object.keys(account)?.length == 0) {
              loginZaloPhoneNumber()
              return
            }
            navigate('/service_management')
          }}>
            <div className='ml-[15px]'>Quản lý dịch vụ</div>
            <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
          </div>

          <div className='article-2 box-shadow-2 text-1' onClick={() => {
            if (Object.keys(account)?.length == 0) {
              loginZaloPhoneNumber()
              return
            }
            navigate('/verified_partners')
          }}>
            <div className='ml-[15px]'>Quản lý đơn vị</div>
            <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
          </div>
        </>}
        
        <div className='article-2 box-shadow-2 text-1' onClick={() => {
          if (Object.keys(account).length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/my_orders/user')
        }}>
          <div className='ml-[15px]'>Đơn hàng của tôi</div>
          <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
        </div>

        <div className='article-2 box-shadow-2 text-1' onClick={() => {
          if (Object.keys(account).length == 0) {
            loginZaloPhoneNumber()
            return
          }
          navigate('/favourite_partners')
        }}>
          <div className='ml-[15px]'>Đơn vị yêu thích</div>
          <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
        </div>
        {!loadingLogout ? <button className='article-2 box-shadow-2 text-1 mb-[90px]' onClick={triggerLogout}>
          <div className='ml-[15px]'>Đăng xuất</div>
          <div className='mr-[5px] '><Icon icon='zi-chevron-right' size={30} /></div>
        </button>
        : <Spinner />}
      </div>
    </div>
  )
}

export default Dashboard