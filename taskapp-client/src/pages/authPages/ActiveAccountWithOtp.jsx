import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AccountApi } from '../../api/accountApi'
import { Page, useNavigate, Spinner, useSnackbar } from 'zmp-ui'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { accountState, activeTabState, otpAccountInforState } from '../../State'
import UseDebounce from '../../utils/UseDebounce'

function ActiveAccount() {
  const useDebounce = UseDebounce()
  const navigate = useNavigate()
  const {openSnackbar, closeSnackbar} = useSnackbar()
  const otpAccountInfor = useRecoilValue(otpAccountInforState)
  // const [account, setAccount] = useRecoilState(accountState)
  const { activeAccountOtpApi, resendOtpApi } = AccountApi()
  const [message, setMessage] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setActiveTab = useSetRecoilState(activeTabState)
  const [isResendOtpLoading, setIsResendOtpLoading] = useState(false)
  

  const handleVerifyOtp = () => {

    if (otp?.length != 4) {
      openSnackbar({
        type: 'warning',
        text: 'Mã OTP phải bao gồm 4 chữ số'
      })
      return
    }
    setIsLoading(true)
    activeAccountOtpApi({otp: otp, userId: otpAccountInfor?._id, task: 'register'})
    .then((data) => {
      openSnackbar({
        text: data?.message,
        type: "success",
      });
      setIsLoading(false)
      navigate('/')
      setActiveTab('home')
    }).catch((e) => {
      openSnackbar({
        text: e?.message,
        type: "error",
      });
      setIsLoading(false)

    })
  }

  const resendOtp = () => {
    setIsResendOtpLoading(true)
    resendOtpApi({userId: otpAccountInfor?._id, email: otpAccountInfor?.email, task: 'register'})
    .then((data) => {
      setIsResendOtpLoading(false)
      openSnackbar({
        text: data?.message,
        type: "success",
      });
    }).catch((e) => {
      openSnackbar({
        text: e?.message,
        type: "error",
      });
    })
  }

  const handleResendOtp = () => {
    useDebounce(resendOtp, 1000)
  }
  
  return (
    <Page>
      <div className='h-[90%] flex justify-center items-center'>
        <div className='box-1 h-[300px] relative'>
          <div className='w-[80%] text-[20px] relative'>
            <input type="text" className='text-input-1' onChange={(e) => setOtp(e.target.value)} placeholder='Mã OTP' />
            {
              isLoading
              ? <div className='flex justify-center'><Spinner visible /></div>
              : <button onClick={handleVerifyOtp} className='btn-1 mt-[20px]'>XÁC NHẬN</button>
            }
          </div>
          {isResendOtpLoading 
          ? <div className='absolute bottom-[10px] flex justify-center'><Spinner /></div>
          : <div onClick={handleResendOtp} className='absolute bottom-[10px] text-[#4389fa]'>Gửi lại mã otp</div>}
        </div>
      </div>

    </Page>
  )
}

export default ActiveAccount