import React, {useState} from 'react'
import BottomNavbar from '../../components/BottomNavbar'
import { Page, useSnackbar, useNavigate, Spinner } from 'zmp-ui'
import { validatePassword } from '../../utils/validate'
import { AccountApi } from '../../api/accountApi'
import UseDebounce from '../../utils/UseDebounce'
import { fillAllFieldsWarning, passwordWarning, validInforWarning } from '../../utils/warning'
import { useSetRecoilState } from 'recoil'
import { activeTabState } from '../../State'

function ResetPasswordWithOtp({userId, email}) {
  const useDebounce = UseDebounce()
  const { resendOtpApi } = AccountApi()
  const navigate = useNavigate()
  const {openSnackbar} = useSnackbar()
  const { resetPasswordWithOtpApi } = AccountApi()
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResendOtp, setIsResendOtp] = useState(false)
  const [isError, setIsError] = useState(false)
  const setActiveTab = useSetRecoilState(activeTabState)

  const handlePasswordChange = (e) => {
    const passwordChange = e.target.value

    setPassword(passwordChange)
    
    if (!validatePassword(passwordChange)) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!password || !otp) {
      openSnackbar({
        text: fillAllFieldsWarning,
        type: "warning",
      });
      return
    }
    if (otp?.length !== 4) {
      openSnackbar({
        text: "OTP phải có 4 kí tự là số",
        type: "warning",
      });
      return
    }
    if (isError?.password) {
      openSnackbar({
        text: validInforWarning,
        type: "warning",
      });
      return
    } 
    setIsLoading(true)
    resetPasswordWithOtpApi({userId: userId, otp: otp, password: password, task: 'resetPassword'})
    .then(data => {
      openSnackbar({
        text: data?.message,
        type: "success",
      });
      navigate('/')
      setActiveTab('home')
      setIsLoading(false)
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: "error",
      });
      setIsLoading(false)
    })
  }

  const resendOtp = () => {
    setIsResendOtp(true)
    resendOtpApi({userId: userId, email: email, task: 'resetPassword'})
    .then((data) => {
      setIsResendOtp(false)
      openSnackbar({
        text: data?.message,
        type: "success",
      });
    }).catch((e) => {
      setIsResendOtp(false)
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
        {/* login box */}
        <div className='box-1 relative'>
          <div className='h1'>Đổi mật khẩu</div>
          <form className='form-1' onSubmit={handleSubmit}> 
            <div>Mật khẩu mới</div>
            <input type="password" name='password' onChange={handlePasswordChange} className='text-input-1' placeholder='Phải có ít nhất 8 kí tự' />
            <div className={isError ? "error-input opacity-100" : "error-input"}>{passwordWarning}</div>
            <div>OTP</div>
            <input type="text" name='otp' onChange={(e)=>{setOtp(e.target.value)}} className='text-input-1' placeholder='OTP gồm 4 số' />
            {isLoading
              ? <div className='flex justify-center'><Spinner visible /></div>
              : <button type='submit' className='btn-1 mt-[30px] mb-[20px]'>XÁC NHẬN</button>
            }
          </form>
          {isResendOtp
          ? <div className='flex justify-center mt-[10px]'><Spinner /></div>
          : <div onClick={handleResendOtp} className='absolute bottom-[10px] text-[#4389fa]'>Gửi lại mã otp</div>}
        </div>  
      </div>
    </Page> 
  )
}

export default ResetPasswordWithOtp