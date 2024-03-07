import React, {useState} from "react";
import { AccountApi } from "../../api/accountApi";
import { Spinner, useSnackbar } from "zmp-ui";
import { validateEmail, validateStringLength } from "../../utils/validate";
import AvatarUpdate from "./AvatarUpdate";
import { emailWarning } from "../../utils/warning";

function BasicInforUpdate({account, setAccount}) {
  const {openSnackbar} = useSnackbar()
  const {updateBasicApi} = AccountApi()
  const [isError, setIsError] = useState({fullName: false, email: false})
  const [isLoading, setIsLoading] = useState(false)
  const [basicInfor, setBasicInfor] = useState({
    phoneNumber: account?.phoneNumber,
    email: account?.email,
    fullName: account?.fullName,
    dateOfBirth: account?.dateOfBirth,
    gender: account?.gender
  })

  const handleChange = (e) => {
    const {name, value} = e.target

    setBasicInfor({...basicInfor, [name]: value})

    switch (name) {
      case 'fullName':
        if (!validateStringLength(value, 30)) {
          setIsError({...isError, fullName: true})
        } else {
          setIsError({...isError, fullName: false})
        }
        break;
      case 'email': 
        if (!validateEmail(value)) {
          setIsError({...isError, email: true})
        } else {
          setIsError({...isError, email: false})
        }
      default:
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isError?.fullName) {
      openSnackbar({
        text: "Nhập chưa đúng định dạng thông tin",
        type: 'warning'
      })
      return
    }
    setIsLoading(true)
    updateBasicApi({fullName: basicInfor?.fullName, dateOfBirth: basicInfor?.dateOfBirth, gender: basicInfor?.gender})
    .then(data => {
      setAccount({...account, fullName: basicInfor?.fullName, dateOfBirth: basicInfor?.dateOfBirth, gender: basicInfor?.gender})
      openSnackbar({
        text: data.message,
        type: "success",
      });
      setIsLoading(false)
    }).catch(e => {
      openSnackbar({
        text: e.message,
        type: 'error'
      })
      setIsLoading(false)
    })
  }

  return (
    <div className="box-1 mt-[20px]">
      <div className="h1">Cập nhật thông tin</div>
      <AvatarUpdate account={account} setAccount={setAccount} />      
      <form onSubmit={handleSubmit} className="form-1">
        <div>Sđt</div>
        <input type="text" defaultValue={basicInfor?.phoneNumber} name='phoneNumber' placeholder='Sđt' className='text-input-1' disabled />
        <div className={isError?.fullName ? "error-input opacity-100" : "error-input"}></div>

        <div>Email</div>
        <input type="text" defaultValue={basicInfor?.email} name='email' placeholder='Email' onChange={handleChange} className='text-input-1' />
        <div className={isError?.email ? "error-input opacity-100" : "error-input"}>{emailWarning}</div>


        <div>Họ và tên</div>
        <input type="text" defaultValue={basicInfor?.fullName} name='fullName' onChange={handleChange} className='text-input-1' placeholder='Phải có ít nhất 8 kí tự' />
        <div className={isError?.fullName ? "error-input opacity-100" : "error-input"}>Không quá 30 kí tự</div>
    
        <div>Ngày sinh</div>
        <input type="date" defaultValue={basicInfor?.dateOfBirth} name="dateOfBirth" onChange={handleChange} className="text-input-1" />
        
        <div className="mt-[20px]">Giới tính</div>
        <div>
          <input type="radio" id="male" name="gender" value="male" onChange={handleChange} checked={basicInfor.gender=='male'?"checked":""}/>
          <label htmlFor="male" className="ml-[10px]">Nam</label><br/>
          <input type="radio" id="female" name="gender" value="female" onChange={handleChange}  checked={basicInfor.gender=='female'?"checked":""}/>
          <label htmlFor="female" className="ml-[10px]">nữ</label><br></br>
        </div>
        {
          isLoading
          ? <div className='flex justify-center'><Spinner visible /></div>
          : <button type="submit" className='btn-1 mt-[20px]'>XÁC NHẬN</button>
        }
      </form>
    </div>
  );
}

export default BasicInforUpdate;
