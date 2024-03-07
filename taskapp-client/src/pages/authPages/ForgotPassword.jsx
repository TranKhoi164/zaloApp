import React, { useState } from "react";
import { Page, useNavigate, useSnackbar, Spinner } from "zmp-ui";
import BottomNavbar from "../../components/BottomNavbar";
import { AccountApi } from "../../api/accountApi";
import { validateEmail } from "../../utils/validate";
import { emailWarning } from "../../utils/warning";

function ForgotPassword({setUserId, email, setEmail}) {
  const navigate = useNavigate()
  const {openSnackbar} = useSnackbar()
  const { sendResetPasswordEmailApi } = AccountApi()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState({email: false})
  console.log(email);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      openSnackbar({
        text: emailWarning,
        type: "warning",
      });
      return
    }
    setIsLoading(true)
    
    sendResetPasswordEmailApi({email: email})
      .then(data => {
        openSnackbar({
          text: data?.message,
          type: "success",
        });
        setUserId(data?.userId)
        setIsLoading(false)
        navigate('/reset_password_with_otp')
      }).catch(e => {
        openSnackbar({
          text: e?.message,
          type: "error",
        });
        setIsLoading(false)
      })
  }

  const handleChange = (e) => {
    const emailVal = e.target.value
    setEmail(emailVal)
    if (!validateEmail(emailVal)) {
      setIsError({email: true})
    } else setIsError({email: false})
  }

  return (
    <Page>
      <div className='h-[90%] flex justify-center items-center'>
        {/* login box */}
        <div className='box-1'>
          <div className='h1'>Nhập email</div>
          <form className='form-1' onSubmit={handleSubmit}>
            <input type="email" className="text-input-1" placeholder="Email" onChange={handleChange} />
            <div className={isError?.email ? "error-input opacity-100" : "error-input"}>{emailWarning}</div>
            {isLoading 
              ? <div className='flex justify-center'><Spinner visible /></div>
              : <button type="submit" className='btn-1'>Xác nhận</button>
            }
          </form>
        </div>  
      </div>
      <BottomNavbar />
    </Page>
  )
}

export default ForgotPassword;
