import React, {useState} from "react";
import { AccountApi } from "../../api/accountApi";
import { Spinner, useSnackbar } from "zmp-ui";
import { validatePassword, validateStringLength } from "../../utils/validate";


function PasswordUpdate({account, setAccount}) {
  const {openSnackbar} = useSnackbar()
  const {updatePasswordApi} = AccountApi()
  const [isError, setIsError] = useState({
    password: false,
    newPassword: false,
    reNewPassword: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    password: '',
    newPassword: '',
    reNewPassword: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target

    setData({...data, [name]: value})

    switch (name) {
      case 'password':
      case 'newPassword':
        if (!validatePassword(value)) {
          setIsError({...isError, [name]: true})
        } else {
          setIsError({...isError, [name]: false})
        }
        break;
      case 'reNewPassword':
        if (data?.newPassword !== value) {
          setIsError({...isError, reNewPassword: true})
        } else {
          setIsError({...isError, reNewPassword: false})
        }
      default:
        break;
    }
  }

  const handleSubmit2 = (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!data?.password || !data?.newPassword || !data?.reNewPassword) {
      setIsLoading(false)
      openSnackbar({
        text: 'Cần nhập đầy đủ thông tin',
        type: 'warning'
      })
      return
    }
    if (isError?.password || isError?.newPassword || isError?.reNewPassword) {
      setIsLoading(false)
      openSnackbar({
        text: 'Nhập chưa đúng định dạng thông tin',
        type: 'warning'
      })
      return
    }
    updatePasswordApi({password: data?.password, newPassword: data?.newPassword})
    .then(data => {
      setIsLoading(false)
      openSnackbar({
        text: data?.message,
        type: "success",
      });
    }).catch(e => {
      setIsLoading(false)
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
  }

  return (
    <div className="box-1 mt-[10px]">
      <div className="h1">Cập nhật mật khẩu</div>
      <form onSubmit={handleSubmit2} className="form-1">
        <div>Mật khẩu hiện tại</div>
        <input type="password" name='password' onChange={handleChange} className='text-input-1' placeholder='Chứa ít nhất 8 kí tự' />
        <div className={isError?.password ? "error-input opacity-100" : "error-input"}>Có số, kí tự đặc biệt, hoa, thường</div>
    
        <div>Mật khẩu mới</div>
        <input type="password" name='newPassword' onChange={handleChange} className='text-input-1' placeholder='Chứa ít nhất 8 kí tự' />
        <div className={isError?.newPassword ? "error-input opacity-100" : "error-input"}>Có số, kí tự đặc biệt, hoa, thường</div>

        <div>Nhập lại mật khẩu mới</div>
        <input type="password" name='reNewPassword' onChange={handleChange} className='text-input-1' placeholder='Chứa ít nhất 8 kí tự' />
        <div className={isError?.reNewPassword ? "error-input opacity-100" : "error-input"}>Nhập lại không chính xác</div>
        {
          isLoading
          ? <div className='flex justify-center'><Spinner visible /></div>
          : <button type="submit" className='btn-1 mt-[20px]'>XÁC NHẬN</button>
        }
      </form>
    </div>
  );
}

export default PasswordUpdate