import React, { useEffect, useState } from 'react'
import { validateEmail, validatePhoneNumber } from '../../utils/validate'
import { emailWarning, fillAllFieldsWarning, phoneNumberWarning, unLoggedInWarning, validInforWarning } from '../../utils/warning'
import Chip from '../ChipComponent'
import { useRecoilState, useRecoilValue } from 'recoil'
import { accountState } from '../../State'
import AddressForm from '../form/AddressForm'
import { useSnackbar } from 'zmp-ui'
import { OrderApi } from '../../api/orderApi'
import { NotificationApi } from '../../api/notificationApi'
import { userOrderBody, userOrderTitle } from '../../utils/notification'
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis'
import { AccountApi } from '../../api/accountApi'

function OrderServiceDialog({setDialog, services, partnerId}) {
  const {loginZaloPhoneNumberApi} = AccountApi()
  const {createOrderApi} = OrderApi()
  const {createNotificationApi} = NotificationApi()
  const [account, setAccount] = useRecoilState(accountState)
  const {openSnackbar} = useSnackbar()
  const [location, setLocation] = useState({
    ward: '',
    province: '',
    district: '',
    address: ''
  })
  const [serviceName, setServiceName] = useState('')
  const [data, setData] = useState({
    userName: account?.fullName || '',
    phoneNumber: account?.phoneNumber || '',
    date: '',
    service: '',
    userNote: '',
  })
  const [isError, setIsError] = useState({
    userName: false,
    phoneNumber: false,
    email: false,
    date: false,
    service: false,
    userNote: false,
  })

  useEffect(() => {
    if (Object.keys(account).length == 0) {
      loginZaloPhoneNumber()
    }
  }, [])
  
  console.log(data);

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
      openSnackbar({
        text: e.message,
        type: 'error'
      })
    }
  }

  const handleChange = async (e) => {
    const {name, value} = e.target

    if (name == 'service') {
      setData({...data, service: JSON.parse(value)?.serviceId})
      setServiceName(JSON.parse(value)?.serviceName)
      return
    }

    setData({...data, [name]: value})

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          setIsError({...isError, email: true})
          return
        } else {
          setIsError({...isError, email: false})
        }
        break
      case 'phoneNumber':
        if (!validatePhoneNumber(value)) {
          setIsError({...isError, phoneNumber: true})
        } else {
          setIsError({...isError, phoneNumber: false})
        }
        break;

      case 'date': 
        const newDate = new Date(value)
        const currentDate = new Date()
        
        if (newDate.getDate() <= currentDate.getDate()) {
          setIsError({...isError, date: true})
        } else {
          setIsError({...isError, date: false})
        }
        break
      default:
        break;
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    // if (Object.values(account)?.length <= 0) {
    //   openSnackbar({
    //     type: 'warning',
    //     text: unLoggedInWarning
    //   })
    //   return
    // }
    for (const el in isError) {
      if (isError[el]) {
        openSnackbar({
          text: validInforWarning,
          type: "warning",
        });
        return
      }
    }
    for (const el in data) {
      if (el == 'userNote') {
        continue
      }
      if (!data[el]) {
        openSnackbar({
          text: fillAllFieldsWarning,
          type: "warning",
        });
        return
      }
    }
    for (const el in location) {
      if (!location[el]) {
        openSnackbar({
          text: fillAllFieldsWarning,
          type: "warning",
        });
        return
      }
    }

    //user, partner, userName, phoneNumber, date, service, userNote, province, district, ward, address
    createOrderApi({user: account?._id, email: data?.email, location: location?.province, partner: partnerId, userName: data?.userName, phoneNumber: data?.phoneNumber, date: data?.date, service: data?.service, userNote: data?.userNote, province: location?.province, ward: location?.ward, district: location?.district, address: location?.address})
    .then(data => {
      openSnackbar({
        text: data?.message,
        type: 'success',
      });
      setDialog(false)
    }).catch(e => {
      console.log('e: ', e);
      openSnackbar({
        text: e?.message,
        type: 'error',
      });
      setDialog(false)
    })
  }



  return (
    <div className="dialog-1 flex flex-col items-center">
      <div onClick={()=>setDialog(false)} className='mt-[20px] text-red-400 font-bold w-[95%] text-[20px] flex justify-end'>X</div>
      <form className='form-1 mb-[100px]' onSubmit={handleSubmit}>
        <div>Tên người dùng</div>
        <input type="text" name='userName' className='text-input-1 mt-[10px]' defaultValue={account?.fullName} onChange={handleChange} placeholder='Họ và tên' />
        <div className='error-input'></div>

        <div>Sđt</div>
        <input type="number" name='phoneNumber' className='text-input-1 mt-[10px]' defaultValue={account?.phoneNumber} onChange={handleChange} placeholder='Sđt' />
        <div className={isError?.phoneNumber ? 'error-input opacity-100' : 'error-input'}>{phoneNumberWarning}</div>
        
        <div>Thời gian</div>
        <input type="date" name='date' onChange={handleChange} placeholder='Họ và tên' className='text-input-1 mt-[10px]' />
        <div className={isError?.date ? 'error-input opacity-100' : 'error-input'}>Ngày chọn không hợp lệ</div>
        
        <div>
          <div className="mr-[15px]">Dịch vụ:</div>
          <select name="service" id="service" className='text-input-1 mt-[10px]' defaultValue={undefined} onChange={handleChange}>
            <option value={undefined}>Chọn dịch vụ</option>
            {services?.map(service => {
              const val = JSON.stringify({serviceId: service?._id, serviceName: service?.name})
              return <option key={service?._id} value={val}>{service?.name}</option>
            })}
          </select>
        </div>
        <div className='error-input'></div>

        <div className='mb-[10px]'>Địa chỉ</div>
        <AddressForm location={location} setLocation={setLocation} />
        <input type="text" name='address' className='text-input-1 mt-[10px]' onChange={(e)=>setLocation({...location, address:e.target.value})} placeholder='Địa chỉ' />
        <div className='error-input'></div>

        <div>Ghi chú</div>
        <textarea name="userNote" id="userNote" className='text-area-1 h-[100px]' onChange={handleChange}></textarea>

        <button className='btn-1 mt-[50px]'>Xác nhận</button>
      </form>
    </div>
  )
}

export default OrderServiceDialog