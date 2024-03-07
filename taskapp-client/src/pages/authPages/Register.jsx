import React, {useState} from 'react'
import { Page, useNavigate, Spinner, useSnackbar } from 'zmp-ui'
import BottomNavbar from '../../components/BottomNavbar'
import { AccountApi } from '../../api/accountApi'
import { validateEmail, validatePassword, validateStringLength } from '../../utils/validate'
import UseDebounce from '../../utils/UseDebounce'
import { useSetRecoilState } from 'recoil'
import { accountState, otpAccountInforState } from '../../State'
import { emailWarning, fillAllFieldsWarning, fullNameWarning, passwordWarning, rePasswordWarning, validInforWarning } from '../../utils/warning'

function Register() {
  const {registerApi} = AccountApi()
  const navigate = useNavigate()
  const {openSnackbar, closeSnackbar} = useSnackbar()
  const setOtpAccountInfor = useSetRecoilState(otpAccountInforState)
  const [isLoading, setIsLoading] = useState(false)
  const [userRegister, setUserRegister] = useState({
    fullName: '',
    email: '',
    password: '',
    rePassword: ''
  })
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    rePassword: false,
    fullName: false,
  })

  const handleChange = (e) => {
    const {name, value} = e.target

    setUserRegister({
      ...userRegister,
      [name]: value
    })

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          setIsError({...isError, email: true})
          return
        } else {
          setIsError({...isError, email: false})
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          setIsError({...isError, password: true})
          return
        } else {
          setIsError({...isError, password: false})
        }
        break;
      case 'rePassword':
        if (userRegister?.password !== value) {
          setIsError({...isError, rePassword: true})
        } else {
          setIsError({...isError, rePassword: false})
        }
        break;
      case 'fullName':
        if (!validateStringLength(value, 30)) {
          setIsError({...isError, fullName: true})
        } else {
          setIsError({...isError, fullName: false})
        }
        break;
      default:
        break;
    }
  }
  console.log(userRegister);

  const handleSubmit = (e) => {
    e.preventDefault()
    for (const pro in userRegister) {
      if (!userRegister[pro]) {
        openSnackbar({
          icon: 'warning',
          text: fillAllFieldsWarning,
        });
        return
      }
    }
    if (isError?.email || isError?.password || isError?.rePassword || isError?.fullName) {
      openSnackbar({
        type: 'warning',
        text: validInforWarning,
      });
      return
    }
    setIsLoading(true)
    registerApi({
      email: userRegister?.email,
      password: userRegister?.password,
      fullName: userRegister?.fullName
    }).then((data) => {
      setOtpAccountInfor({_id: data?.account?._id, email: data?.account?.email})
      setIsLoading(false)
      openSnackbar({
        text: data?.message,
        type: "success",
      });
      navigate('/active_account_with_otp')
    }).catch(data => {
      openSnackbar({
        text: data?.message,
        type: 'error'
      })
      setIsLoading(false)
    })
  }

  return (
    <Page>
      <div className='flex justify-center items-center h-[120vh]'>
        {/* login box */}
        <div className='box-1'>
          <div className='h1'>Đăng Ký</div>
          <form className='form-1' onSubmit={handleSubmit}>
            <div>Email</div>
            <input type="email" name='email' onChange={handleChange} className='text-input-1' placeholder='Nhập đúng định dạng email' />
            <div className={isError?.email ? "error-input opacity-100" : "error-input"}>{emailWarning}</div>
            
            <div>Mật khẩu</div>
            <input type="password" name='password' onChange={handleChange} className='text-input-1' placeholder='Phải có ít nhất 8 kí tự' />
            <div className={isError?.password ? "error-input opacity-100" : "error-input"}>{passwordWarning}</div>
            
            <div>Nhập lại mật khẩu</div>
            <input type="password" name='rePassword' onChange={handleChange} className='text-input-1' placeholder='Nhập lại mật khẩu' />
            <div className={isError?.rePassword ? "error-input opacity-100" : "error-input"}>{rePasswordWarning}</div>
            
            <div>Họ và tên</div>
            <input type="text" name='fullName' onChange={handleChange} className='text-input-1' placeholder='Nhập không quá 30 kí tự' />
            <div className={isError?.fullName ? "error-input opacity-100" : "error-input"}>{fullNameWarning}</div>
            <div className='flex justify-between'>
              <div className='hidden'>Quên mật khẩu?</div>
              <div className='text-[#4088ff]' onClick={() => navigate('/login')}>Đăng nhập</div>
            </div>
            {
              isLoading
              ? <div className='flex justify-center'><Spinner visible /></div>
              : <button type='submit' className='btn-1 mt-[20px]'>ĐĂNG KÝ</button>
            }
            
          </form>
        </div>  
      </div>
    </Page> 
  )
}

export default Register