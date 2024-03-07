import React, {useState} from 'react'
import { Page, Spinner, useNavigate, useSnackbar } from 'zmp-ui'
import BottomNavbar from '../../components/BottomNavbar'
import { validateEmail, validatePassword, validateStringLength } from '../../utils/validate'
import { AccountApi } from '../../api/accountApi'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { accountState, activeTabState } from '../../State'
import UseDebounce from '../../utils/UseDebounce'
import { emailWarning, fillAllFieldsWarning, passwordWarning, validInforWarning } from '../../utils/warning'
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis'
import { data } from 'autoprefixer'

function Login() {
  const useDebounce = UseDebounce()
  const {openSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const { loginApi, loginZaloPhoneNumberApi } = AccountApi()
  const [account, setAccount] = useRecoilState(accountState)
  const [isLoading, setIsLoading] = useState(false)
  const setActiveTab = useSetRecoilState(activeTabState)
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  })
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    rePassword: false,
    fullName: false,
  })

  // const handleChange = (e) => {
  //   const {name, value} = e.target

  //   setUserLogin({...userLogin, [name]: value})

  //   switch (name) {
  //     case 'email':
  //       if (!validateEmail(value)) {
  //         setIsError({...isError, email: true})
  //         return
  //       } else {
  //         setIsError({...isError, email: false})
  //       }
  //       break;
  //     case 'password':
  //       if (!validatePassword(value)) {
  //         setIsError({...isError, password: true})
  //         return
  //       } else {
  //         setIsError({...isError, password: false})
  //       }
  //       break;
  //     case 'rePassword':
  //       if (userRegister?.password !== value) {
  //         setIsError({...isError, rePassword: true})
  //       } else {
  //         setIsError({...isError, rePassword: false})
  //       }
  //       break;
  //     case 'fullName':
  //       if (!validateStringLength(value, 30)) {
  //         setIsError({...isError, fullName: true})
  //       } else {
  //         setIsError({...isError, fullName: false})
  //       }
  //       break;
    
  //     default:
  //       break;
  //   }

  //   setUserLogin({
  //     ...userLogin,
  //     [name]: value
  //   })
  // }


  // const handleLoginWithEmail = (e) => {
  //   e.preventDefault()
  //   for (const pro in userLogin) {
  //     if (!userLogin[pro]) {
  //       openSnackbar({
  //         type: 'warning',
  //         text: fillAllFieldsWarning,
  //       });
  //       return
  //     }
  //   }
  //   if (isError?.email || isError?.password) {
  //     openSnackbar({
  //       text: validInforWarning,
  //       type: 'warning'
  //     });
  //     return
  //   }
  //   setIsLoading(true)
  //   loginApi({email: userLogin?.email, password: userLogin?.password})
  //   .then((data) => {
  //     openSnackbar({
  //       text: data?.message,
  //       type: "success",
  //     });
  //     setIsLoading(false)
  //     setAccount(data?.account)
  //     navigate('/')
  //     setActiveTab('home')
  //   }).catch(e => {
  //     setIsLoading(false)
  //     openSnackbar({
  //       text: e?.message,
  //       type: 'error'
  //     })
  //   })
  // }

  const loginZaloPhoneNumber = async () => {
    try {
      const zaloAccessToken = await getAccessToken({})
      const phoneNumberToken = await getPhoneNumber({})
      loginZaloPhoneNumberApi({zaloAccessToken: zaloAccessToken, phoneNumberToken: phoneNumberToken?.token})
      .then(data => {
        setAccount({...data?.account})
      }).catch(e => {
        useSnackbar({
          type: 'error',
          text: e?.message
        })
      })
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Page>
     <div className='h-[90%] flex justify-center items-center'>
        {/* login box */}
          <div className='box-1 w-[90%]'>
            {
              isLoading
              ? <div className='flex justify-center'><Spinner visible /></div>
              : <button onClick={loginZaloPhoneNumber} className='btn-1 w-[90%] mb-[20px] mt-[20px]'>ĐĂNG NHẬP</button>
            }
            {/* 
             */}
        </div>  
      </div>
    </Page> 
  )
}

export default Login