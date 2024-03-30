import React, {useState, useEffect} from 'react'
import { Icon, Page, Spinner, useNavigate, useSnackbar } from 'zmp-ui'
import BottomNavbar from '../../components/BottomNavbar'
import { validateEmail, validatePassword, validatePhoneNumber, validateStringLength } from '../../utils/validate'
import { AccountApi } from '../../api/accountApi'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { accountState, activeTabState, isNewUnverifiedPartner } from '../../State'
import UseDebounce from '../../utils/UseDebounce'
import { emailWarning, fillAllFieldsWarning, fullNameWarning, passwordWarning, phoneNumberWarning, rePasswordWarning, validInforWarning } from '../../utils/warning'
import AddressForm from '../../components/form/AddressForm'
import { ServiceApi } from '../../api/serviceApi'
import ServiceForm from '../../components/form/ServiceForm'
import { objectToString } from '../../utils/stringFunc'
import { AddressApi } from '../../api/addressApi'
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis'

function PartnerRegister() {
  const setIsNewUnverifiedPartner = useSetRecoilState(isNewUnverifiedPartner)
  const setActiveTab = useSetRecoilState(activeTabState)
  const {openSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [account, setAccount] = useRecoilState(accountState)
  const {createAddressesApi} = AddressApi()
  const { partnerRegisterApi, loginZaloPhoneNumberApi } = AccountApi()
  const { getServicesApi } = ServiceApi()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [openSelectService, setOpenSelectService] = useState(false)
  const [openAddAddress, setOpenAddAddress] = useState(false)
  const [userRegister, setUserRegister] = useState({
    fullName: account?.fullName || '',
    phoneNumber: account?.phoneNumber || '',
    partnerName: '',
    description: '',
    email: account?.email || '',
    location: []
  })
  const [isError, setIsError] = useState({
    email: false,
    fullName: false,
    phoneNumber: false
  })
  const [location, setLocation] = useState({
    province: '',
    district: '',
    ward: '',
  })
  const [addresses, setAddresses] = useState([])


  useEffect(() => {
    getServicesApi()
    .then(data => {
      setServices(data?.services)
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
    if (Object.keys(account).length == 0) {
      loginZaloPhoneNumber()
    }
  }, [])

  const loginZaloPhoneNumber = async () => {
    try {
      const zaloAccessToken = await getAccessToken({})
      const phoneNumberToken = await getPhoneNumber({})
      loginZaloPhoneNumberApi({zaloAccessToken: zaloAccessToken, phoneNumberToken: phoneNumberToken?.token})
      .then(data => {
        setUserRegister({...userRegister, phoneNumber: data?.account?.phoneNumber})
        setAccount({...data?.account})
      }).catch(e => {
        useSnackbar({
          type: 'error',
          text: e?.message
        })
      })
    } catch (e) {
      useSnackbar({
        text: e?.message,
        type: 'error'
      })
    }
  }
  



  const handleChange = (e) => {
    const {name, value} = e.target
    setIsLoading(false)

    setUserRegister({...userRegister, [name]: value})

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          setIsError({...isError, email: true})
          return
        } else {
          setIsError({...isError, email: false})
        }
        break;
      case 'fullName':
        if (!validateStringLength(value, 30)) {
          setIsError({...isError, fullName: true})
        } else {
          setIsError({...isError, fullName: false})
        }
        break;
      case 'phoneNumber':
        if (!validatePhoneNumber(value)) {
          setIsError({...isError, phoneNumber: true})
        } else {
          setIsError({...isError, phoneNumber: false})
        }
      default:
        break;
    }

    setUserRegister({
      ...userRegister,
      [name]: value
    })
  }


  const handleAddAddress = (e) => {
    e.preventDefault()
    if (!location?.province || !location?.district || !location?.ward || !location?.address) {
      openSnackbar({
        type: 'warning',
        text: fillAllFieldsWarning
      })
      return
    }
    setUserRegister({...userRegister, location: [...userRegister?.location, location?.province]})
    setAddresses([...addresses, location])
    
    
    setLocation({province: '', district: '', ward: '', address: ''})

  }

  const handleDeleteAddress = async (address) => {
    try {
      const addressArr = addresses?.filter(el => el?.province != address?.province || el?.district != address?.district || el?.ward != address?.ward || el?.address != address?.address)
      setUserRegister({...userRegister, location: [...addressArr]})
      setAddresses([...addressArr])
      // setAccount({...account, addresses: [...addressArr]})
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      // setEditAddressLoading(false)
    }
  }


  const handlePartnerRegister = (e) => {
    e.preventDefault()
    if (selectedServices?.length == 0 || !selectedServices) {
      openSnackbar({
        type: 'warning',
        text: fillAllFieldsWarning,
      });
      return
    }
    if (addresses?.length == 0) {
      openSnackbar({
        icon: 'warning',
        text: fillAllFieldsWarning,
      });
      return
    }
    for (const pro in userRegister) {
      if (!userRegister[pro]) {
        openSnackbar({
          icon: 'warning',
          text: fillAllFieldsWarning,
        });
        return
      }
    }
    for (const pro in isError) {
      if (isError[pro]) {
        openSnackbar({
          type: 'warning',
          text: validInforWarning,
        });
        return
      }
    }
    setIsLoading(true)
    createAddressesApi({addresses: addresses})
    .then(data => {
      partnerRegisterApi({...userRegister, addresses: data?.addresses, services: selectedServices})
      .then((data2) => {
        console.log('data2:', data2);
        setAccount({access_token: account?.access_token, ...data2?.account})
        openSnackbar({
          text: data2?.message,
          type: "success",
        });
        setIsLoading(false)
        setActiveTab('home')
        navigate('/')
      }).catch(e => {
        setIsLoading(false)
        openSnackbar({
          text: e?.message,
          type: 'error'
        })
      })
    }).catch(e => {
      setIsLoading(false)
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })

    //setIsLoading(true)
  }

  console.log(userRegister);


  return (
    <Page>
     <div>
        {/* login box */}
        <div className='header-container'>
          <img className='header-image' src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
          <div className='header-text-container'>
            <div className='header-text'>LIÊN HỆ HỢP TÁC</div>
          </div>
        </div>
        <div className='box-1 pb-[100px] mt-[25px]'>
          <form className='form-1'>
            <div>Tên người liên hệ</div>
            <input type="text" name='fullName' onChange={handleChange} className='text-input-1' placeholder='Nhập tên người liên hệ' defaultValue={account?.fullName} />
            <div className={isError?.fullName ? "error-input opacity-100" : "error-input"}>{fullNameWarning}</div>

            <div>Email</div>
            <input type="email" name='email' onChange={handleChange} className='text-input-1' placeholder='Nhập email' defaultValue={account?.email} />
            <div className={isError?.email ? "error-input opacity-100" : "error-input"}>{emailWarning}</div>

            <div>Số điện thoại</div>
            <input type="number" name='phoneNumber' onChange={handleChange} className='text-input-1' placeholder='Nhập số điện thoại' defaultValue={account?.phoneNumber} />
            <div className={isError?.phoneNumber ? "error-input opacity-100" : "error-input"}>{phoneNumberWarning}</div>

            <div>Tên đơn vị, tổ chức</div>
            <input type="text" name='partnerName' onChange={handleChange} className='text-input-1' placeholder='Nhập tên đơn vị, tổ chức' />
            <div className='opacity-0  error-input'>{emailWarning}</div>
            {/* //todo: select service */}
            <div className='mb-[5px] flex justify-between'> 
              <div>Chọn loại dịch vụ</div>
              {!openSelectService 
              ? <div className='font-trigger-1' onClick={()=>setOpenSelectService(true)}>Select</div>
              : <div className='font-trigger-1' onClick={()=>setOpenSelectService(false)}>Close</div>}
            </div>
            {openSelectService && <ServiceForm services={services} selectedServices={selectedServices} setSelectedServices={setSelectedServices} /> }
            <div className='opacity-0  error-input'>{emailWarning}</div>
            
            {/* //todo: create address */}
            <div className='mb-[5px] flex justify-between'> 
              <div>Địa chỉ</div>
              {!openAddAddress
              ? <div className='font-trigger-1' onClick={()=>setOpenAddAddress(true)}>Add</div>
              : <div className='font-trigger-1' onClick={()=>setOpenAddAddress(false)}>Close</div>}
            </div>
            <div>
              <ul>
                {addresses?.map(address => {
                  return <div className='list-item-2 w-[100%] items-center'>
                    <div>
                      {objectToString({a: address?.address, b: address?.ward, c: address?.district, d: address?.province})}
                    </div>
                    <div className='h-[50px] w-[10%] bg-blue-500 text-white flex items-center justify-center' onClick={()=>handleDeleteAddress(address)}>
                      <Icon icon='zi-close-circle' />
                    </div>
                  </div>
                })}
              </ul>
            </div>
            {openAddAddress && 
              <div className='mt-[5px]'>
                <AddressForm location={location} setLocation={setLocation} />
                <input type="text" name='address' value={location?.address} className='text-input-1 mt-[5px]' onChange={(e)=>setLocation({...location, address: e.target.value})} placeholder='Địa chỉ cụ thể' />
                <button className='btn-1 w-[30%] mt-[5px]' onClick={handleAddAddress}>Thêm</button>
              </div>
            }
            <div className='opacity-0  error-input'>{emailWarning}</div>

            <textarea name="description" onChange={handleChange} id="" cols="10" rows="5" className='text-area-1' placeholder='Mô tả'></textarea>
            {/* <div className='flex justify-between'>
              <div className='text-[#4088ff]' onClick={() => navigate('/forgot_password')}>Quên mật khẩu?</div>
              <div className='text-[#4088ff]' onClick={() => navigate('/register')}>Đăng ký</div>
            </div> */}
            {
              isLoading
              ? <div className='flex justify-center mt-[20px]'><Spinner visible /></div>
              : <button onClick={handlePartnerRegister} className='btn-1 mt-[30px]'>ĐĂNG KÝ</button>
            }
          </form>
        </div>  
      </div>
    </Page> 
  )
}

export default PartnerRegister