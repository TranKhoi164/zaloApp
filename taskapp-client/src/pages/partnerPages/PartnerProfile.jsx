import React, {useEffect, useState} from 'react'
import { Button, Icon, Spinner, useSnackbar } from 'zmp-ui'
import CropImageDialog from '../../components/dialog/CropImageDialog'
import { useRecoilState, useRecoilValue } from 'recoil'
import { accountState } from '../../State'
import MarkdownSyntaxDialog from '../../components/dialog/MarkdownSyntaxDialog'
import { AccountApi } from '../../api/accountApi'
import MarkdownPreview from '@uiw/react-markdown-preview';
import fileToBase64 from '../../utils/fileToBase64'
import { UploadApi } from '../../api/uploadApi'
import ImageUploadedItem from '../../components/partnerProfile/ImageUploadedItem'
import ServiceForm from '../../components/form/ServiceForm'
import { fillAllFieldsWarning, phoneNumberWarning, validInforWarning } from '../../utils/warning'
import { NotificationApi } from '../../api/notificationApi'
import { partnerEditInforBody, partnerEditInforTitle } from '../../utils/notification'
import AddressForm from '../../components/form/AddressForm'
import { objectToString } from '../../utils/stringFunc'
import { AddressApi } from '../../api/addressApi'
import { validatePhoneNumber } from '../../utils/validate'
import { ServiceApi } from '../../api/serviceApi'

function PartnerProfile() {
  const [account, setAccount] = useRecoilState(accountState)
  const {openSnackbar} = useSnackbar()
  const {createAddressApi, deleteAddressApi} = AddressApi()
  const {uploadImageBase64Api} = UploadApi()
  const {getServicesApi} = ServiceApi()
  const {updateBasicApi, getAccountInforApi} = AccountApi()
  const {createNotificationApi} = NotificationApi()
  const [partnerProfile, setPartnerProfile] = useState({
    description: account?.description
  })
  // account?.services?.map((service)=>service?._id) 
  const [services, setServices] = useState(account?.services?.map((service)=>service?._id)||[])
  const [isError, setIsError] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [image, setImage] = useState(null)
  const [openDetailForm, setOpenDetailForm] = useState(false)
  const [editDetailLoading, setEditDetailLoading] = useState(false)
  const [editDescriptionLoading, setEditDescriptionLoading] = useState(false)
  const [editServiceLoading, setEditServiceLoading] = useState(false)
  const [editAddressLoading, setEditAddressLoading] = useState(false)
  const [aspect, setAspect] = useState(18/9)
  const [allServices, setAllServices] = useState([])
  const [openMarkdownDialog, setOpenMarkdownDialog] = useState(false)
  const [editDescription, setEditDescription] = useState(false)
  const [editService, setEditService] = useState(false)
  const [imageUploaded, setImageUploaded] = useState([])
  const [uploadImageLoading, setUploadImageLoading] = useState(false)
  const [openPhonenumberForm, setOpenPhonenumberForm] = useState(false)
  const [location, setLocation] = useState({
    province: '',
    district: '',
    ward: '',
    address: ''
  })
  const [detailName, setDetailName] = useState('')
  const [detailValue, setDetailValue] = useState('')
  const [details, setDetails] = useState([])
  const [openAddressForm, setOpenAddressForm] = useState(false)
  const [editPhonenumberLoading, setEditPhonenumberLoading] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [openEditPartnerName, setOpenEditPartnerName] = useState(false)
  const [openEditPartnerNameLoading, setOpenEditPartnerNameLoading] = useState(false)
  const [newPartnerName, setNewPartnerName] = useState('')
  console.log(location);

  useEffect(() => {
    getServicesApi()
    .then((data)=> {
      setAllServices(data?.services)
    })
    .catch((e) => {
      openSnackbar({
        type: 'warning',
        text: e?.message
      })
    })
  }, [])
  



  const handleChange = (e) => {
    const {name, value} = e.target
    setPartnerProfile({...partnerProfile, [name]: value})
  }





  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    console.log(file?.size)

    if (file?.size > 10e5) {
      openSnackbar({
        text: "File phải có kích thước dưới 1MB",
        type: 'warning'
      })
      return
    }

    setOpenDialog(true)
    setImage(URL.createObjectURL(file))
  }





  const handleUploadImage = async (e) => {
    const file = e?.target?.files[0]
    console.log(file?.size)

    if (file.size > 10e5) {
      openSnackbar({
        text: "File phải có kích thước dưới 1MB",
        type: 'warning'
      })
      return
    }

    setUploadImageLoading(true)
    const base64Img = await fileToBase64(file)
    uploadImageBase64Api({type: 'partnerUpload', image: base64Img})
    .then(data => {
      openSnackbar({
        type: 'success',
        text: data?.message
      })
      console.log(data?.url);
      setUploadImageLoading(false)
      if (account?.uploadImage) {
        updateBasicApi({uploadImage: [...account?.uploadImage, data?.url]})
        setAccount({...account, uploadImage: [...account?.uploadImage, data?.url]})
      } else {
        updateBasicApi({uploadImage: [data?.url]})
        setAccount({...account, uploadImage: [data?.url]})
      }
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
      setUploadImageLoading(false)
    })
  }





  const handleSubmitDescription = () => {
    setEditDescriptionLoading(true)
    updateBasicApi({description: partnerProfile?.description})
    .then(data => {
      openSnackbar({
        text: data?.message,
        type: 'success'
      })
      setAccount({...account, description: partnerProfile?.description})
      setEditDescriptionLoading(false)
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setEditDescriptionLoading(false)
    })
  }




  const handleSubmitService = async (e) => {
    e.preventDefault()
    if (services?.length<=0) {
      openSnackbar({
        text: fillAllFieldsWarning,
        type: 'warning'
      })
      return
    }
    setEditServiceLoading(true)

    try {
      const updateRequest = await updateBasicApi({services: [...services]})
      openSnackbar({
        text: updateRequest?.message,
        type: 'success'
      })
      // await createNotificationApi({
      //   title: partnerEditInforTitle(account?.partnerName), 
      //   body: partnerEditInforBody(account?.partnerName, account?._id, 'services', JSON.stringify(account?.services.map(service=>service?.name))),
      //   roleOfReceiver: 'admin',
      //   sender: account?._id})

      const getAccountReq = await getAccountInforApi({accountId: account?._id})
      setAccount({access_token: account?.access_token, ...getAccountReq?.account})
      setEditServiceLoading(false)
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setEditServiceLoading(false)
    }
  }






  const handleSubmitAddress = async (e) => {
    e.preventDefault()
    console.log('location: ', location);

    for (const el in location) {
      if (!location[el]) {
        openSnackbar({
          text: fillAllFieldsWarning,
          type: 'warning'
        })
        return
      }
    }
    setEditAddressLoading(true)

    try {
      const newAddress = await createAddressApi({...location})
      const updateRequest = await updateBasicApi({location:  [...account?.location || [], location?.province], addresses: [...account?.addresses?.map(el=>el?._id), newAddress?.address?._id]})
      openSnackbar({
        text: updateRequest?.message,
        type: 'success'
      })
      // await createNotificationApi({
      //   title: partnerEditInforTitle(account?.partnerName), 
      //   body: partnerEditInforBody(account?.partnerName, account?._id, 'addresses', JSON.stringify({province: account?.address?.province, district: account?.address?.district, ward: account?.address?.ward})),
      //   roleOfReceiver: 'admin',
      //   sender: account?._id})

      const getAccountReq = await getAccountInforApi({accountId: account?._id})
      setAccount({access_token: account?.access_token, ...getAccountReq?.account})
      setEditAddressLoading(false)
      setLocation({address:'',province:'',ward:'',district:''})
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setEditAddressLoading(false)
      throw new Error(e)
    }
  }






  const handleDeleteAddress = async (addressId) => {
    try {
      const addressArr = account?.addresses?.filter(el=>el?._id!=addressId)

      await deleteAddressApi({addressId: addressId})
      // await createNotificationApi({
      //   title: partnerEditInforTitle(account?.partnerName), 
      //   body: partnerEditInforBody(account?.partnerName, account?._id, 'addresses', JSON.stringify(addressArr)),
      //   roleOfReceiver: 'admin',
      //   sender: account?._id})
      const updateReq = await updateBasicApi({addresses: addressArr?.map(el=>el?._id)})
      openSnackbar({
        text: updateReq?.message,
        type: 'success'
      })

      setAccount({...account, addresses: [...addressArr]})
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setEditAddressLoading(false)
    }
  }





  const handleSubmitPartnerName = async (e) => {
    e.preventDefault()
    if (!newPartnerName) {
      openSnackbar({
        text: fillAllFieldsWarning,
        type: 'warning'
      })
      return
    }
    try {
      setOpenEditPartnerNameLoading(true)
      const updateReq = await updateBasicApi({partnerName: newPartnerName})
      openSnackbar({
        text: updateReq?.message,
        type: 'success'
      })
      setOpenEditPartnerNameLoading(false)

      setAccount({...account, partnerName: newPartnerName})
      setNewPartnerName('')
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setOpenEditPartnerNameLoading(false)
    }
  }





  // const handleSubmitPhonenumber = async (e) => {
  //   e.preventDefault()
  //   if (!validatePhoneNumber(newPhoneNumber)) {
  //     openSnackbar({
  //       text: phoneNumberWarning,
  //       type: 'warning'
  //     })
  //     return
  //   }
  //   try {
  //     await createNotificationApi({
  //       title: partnerEditInforTitle(account?.partnerName), 
  //       body: partnerEditInforBody(account?.partnerName, account?._id, 'phoneNumber', JSON.stringify(account?.phoneNumber)),
  //       roleOfReceiver: 'admin',
  //       sender: account?._id})
  //     const updateReq = await updateBasicApi({phoneNumber: newPhoneNumber})
  //     openSnackbar({
  //       text: updateReq?.message + ', thay đổi sẽ được thông báo tới admin',
  //       type: 'success'
  //     })

  //     setAccount({...account, phoneNumber: newPhoneNumber})
  //     setNewPhoneNumber('')
  //   } catch(e) {
  //     openSnackbar({
  //       text: e?.message,
  //       type: 'error'
  //     })
  //     setEditAddressLoading(false)
  //   }
  // }





  const addDetail = (e) => {
    e.preventDefault()
    if (!detailName || !detailValue) {
      openSnackbar({
        text: fillAllFieldsWarning,
        type: 'warning'
      })
      return
    }
    setDetails([...details, {name: detailName, value: detailValue}]); 
    setDetailName(''); 
    setDetailValue('')
  }




  const removeDetail = (name) => {
    const newDetailArr = details?.filter(el => el?.name != name)
    setDetails(newDetailArr)
  }







  const handleSubmitDetail = async (e) => {
    e.preventDefault()
    if (!details) {
      openSnackbar({
        text: fillAllFieldsWarning,
        type: 'warning'
      })
      return
    }
    try {
      setEditDetailLoading(true)
      // await createNotificationApi({
      //   title: partnerEditInforTitle(account?.partnerName), 
      //   body: partnerEditInforBody(account?.partnerName, account?._id, 'details', JSON.stringify(account?.details)),
      //   roleOfReceiver: 'admin',
      //   sender: account?._id})
      const newDetailsArr = [...account?.details, ...details]
      const updateReq = await updateBasicApi({details: newDetailsArr})
      setEditDetailLoading(false)
      setAccount({...account, details: newDetailsArr})
      setNewPhoneNumber('')
      setDetails([])
      openSnackbar({
        text: updateReq?.message,
        type: 'success'
      })
    } catch(e) {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
      setEditDetailLoading(false)
    }
  }





  const deleteDetail = async (detailName) => {
    const newDetails = account?.details?.filter(el => el?.name != detailName) 
    const updateReq = await updateBasicApi({details: newDetails})
    openSnackbar({
      text: updateReq?.message,
      type: 'success'
    })
    setAccount({...account, details: newDetails})
  }



  


  const openEditDescription = () => {
    setEditDescription(true)
  }
  const closeEditDescription = () => {
    setEditDescription(false)
  }

  const openEditService = () => {
    setEditService(true)
  }
  const closeEditService = () => {
    setEditService(false)
  }




  return (
    <div>
      <div className='h-[90%] flex flex-col justify-center items-center mb-[100px]'>
        {openDialog && <CropImageDialog aspect={aspect} image={image} setImage={setImage} setOpenDialog={setOpenDialog} type='cover' />}
        {openMarkdownDialog && <MarkdownSyntaxDialog setOpenDialog={setOpenMarkdownDialog} />}
        {/* //todo: cover image */}
        {
          account?.cover 
          ? <div className='w-[100%] relative'>
            <img src={account?.cover} alt="cover" className='w-[100%]' />
            <input type="file"  className='hidden' id='change-cover-image' accept='image/jpeg, image/png' onChange={handleCoverImageChange} />
            <label className='absolute top-0 w-[100%] h-[100%]' htmlFor="change-cover-image"></label>
          </div>
          : <div className='cover-image-1'>
            <input type="file" className='hidden' id='change-cover-image' accept='image/jpeg, image/png' onChange={handleCoverImageChange} />
            <label htmlFor="change-cover-image"><Icon icon='zi-camera' className='mr-[10px]' /> Upload image</label>
          </div>
        }
        {/* //todo: profile box */}
        <div className='box-1 mt-[5px] pb-0'>
          <h1 className='h1'>Profile đơn vị</h1>
          <form className='form-1 w-[90%] '>

            {/* //todo: edit partnerName */}
            <div className='mt-[30px]'>
              <div className='flex justify-between'>
                <div className='max-w-[80%]'><span className='font-bold'>Tên đơn vị:</span> {account?.partnerName}</div>
                {!openEditPartnerName
                ? <div className='font-trigger-1' onClick={()=>setOpenEditPartnerName(true)}>Edit</div>
                : <div className='font-trigger-1' onClick={()=>setOpenEditPartnerName(false)}>Close</div>}
              </div>
          
              {openEditPartnerName && <div className='mt-[5px]'>
                <input type="text" className='text-input-1 mt-[5px]' placeholder='Tên đơn vị' onChange={(e)=>setNewPartnerName(e.target.value)} />
                {openEditPartnerNameLoading
                  ? <div className='mt-[5px]'><Spinner /></div>
                  : <button className='btn-1 w-[30%] mt-[5px]' onClick={handleSubmitPartnerName}>Lưu</button>
                }
              </div>}
            </div>


            <div className='flex justify-between mt-[30px]'>
              {/* //todo: edit service */}
              <div><span className='font-bold'>Dịch vụ:</span> {account?.services?.map(s=><> {s?.name},</>)}</div>
              {editService 
                ? <div className='font-trigger-1 mb-[5px]' onClick={closeEditService}>Close</div> 
                : <div className='font-trigger-1' onClick={openEditService}>Edit</div>}
            </div>
            {editService &&
              <>
                <ServiceForm services={allServices} selectedServices={services} setSelectedServices={setServices} />
                {editServiceLoading
                  ? <div className='mt-[5px]'><Spinner /></div>
                  : <button className='btn-1 w-[30%] mt-[5px]' onClick={handleSubmitService}>Xác nhận</button>
                }
              </>
            }

            {/* //todo: edit phonenumber */}
            {/* <div className='mt-[30px]'>
              <div className='flex justify-between'>
                <div className='max-w-[80%]'><span className='font-bold'>Sđt:</span> {account?.phoneNumber}</div>
                {!openPhonenumberForm
                ? <div className='font-trigger-1' onClick={()=>setOpenPhonenumberForm(true)}>Edit</div>
                : <div className='font-trigger-1' onClick={()=>setOpenPhonenumberForm(false)}>Close</div>}
              </div>
          
              {openPhonenumberForm && <div className='mt-[5px]'>
                <input type="number" className='text-input-1 mt-[5px]' placeholder='Sđt mới' onChange={(e)=>setNewPhoneNumber(e.target.value)} />
                {editPhonenumberLoading
                  ? <div className='mt-[5px]'><Spinner /></div>
                  : <button className='btn-1 w-[30%] mt-[5px]' onClick={handleSubmitPhonenumber}>Lưu</button>
                }
              </div>}
            </div> */}

            {/* //todo: edit detail form */}
            <div className='mt-[30px]'>
              <div className='flex justify-between'>
                <div className='max-w-[80%]'><span className='font-bold'>Chi tiết:</span></div>
                {!openDetailForm
                ? <div className='font-trigger-1' onClick={()=>setOpenDetailForm(true)}>Add</div>
                : <div className='font-trigger-1' onClick={()=>setOpenDetailForm(false)}>Close</div>}
              </div>
              <div>
                {account?.details?.map(detail => {
                  return <div className='flex justify-between mt-[5px]'>
                    <div>- <span className='text-[#333] font-bold'>{detail?.name}:</span> {detail?.value}</div>
                    <div className='text-[20px] text-red-500' onClick={()=>deleteDetail(detail?.name)}>x</div>
                  </div>
                })}
              </div>
          
              {openDetailForm && <div className='mt-[5px]'>
                <div className=''>
                  <input type="text" className='text-input-1 mt-[5px]' value={detailName} placeholder='Tên' onChange={(e)=>setDetailName(e.target.value)} />
                  <textarea type="text" className='text-input-1 mt-[5px] h-[100px]' value={detailValue} placeholder='Giá trị' onChange={(e)=>setDetailValue(e.target.value)} />
                </div>
                <div className='flex justify-between'>
                  <button className='btn-3 w-[70px] h-[40px] mt-[5px]' onClick={addDetail}>Thêm</button>

                  {editDetailLoading
                    ? <div className='mt-[5px]'><Spinner /></div>
                    : <button className='btn-1 w-[30%] mt-[5px]' onClick={handleSubmitDetail}>Lưu</button>
                  }
                </div>
                <div>
                  {details?.map(el => {
                    return <div className='flex justify-between mt-[5px]'>
                      <div><span className='text-[#333] font-bold'>{el?.name}:</span> {el?.value}</div>
                      <div className='text-[20px] text-red-500' onClick={()=>removeDetail(el?.name)}>x</div>
                    </div>  
                  })}
                </div>
              </div>}
            </div>


            {/* //todo: edit address */}
            <div className='mt-[30px]'>
              <div className='flex justify-between'>
                <div className='max-w-[80%]'><span className='font-bold'>Địa chỉ:</span></div>
                {!openAddressForm
                ? <div className='font-trigger-1' onClick={()=>setOpenAddressForm(true)}>Add</div>
                : <div className='font-trigger-1' onClick={()=>setOpenAddressForm(false)}>Close</div>}
              </div>
              <div>
                {account?.addresses?.map(address => {
                  return <div className='list-item-2 w-[100%] items-center'>
                    <div>
                    {objectToString({a: address?.address, b: address?.ward, c: address?.district, d: address?.province})}
                    </div>
                    <div className='h-[50px] w-[10%] bg-blue-500 text-white flex items-center justify-center' onClick={()=>handleDeleteAddress(address?._id)}>
                      <Icon icon='zi-close-circle' />
                    </div>
                  </div>
                })}
              </div>
              {openAddressForm && <div className='mt-[5px]'>
                <AddressForm location={location} setLocation={setLocation} />
                <input type="text" className='text-input-1 mt-[5px]' placeholder='Địa chỉ' onChange={(e)=>setLocation({...location, address: e.target.value})} />
                {editAddressLoading
                  ? <div className='mt-[5px]'><Spinner /></div>
                  : <button className='btn-1 w-[30%] mt-[5px]' onClick={handleSubmitAddress}>Thêm</button>
                }
              </div>}
            </div>

            <div className='flex justify-between mt-[30px]'>
              <div>
                {/* //todo: edit description */}
                <div className='font-bold'>Mô tả đơn vị</div>
                {/* //todo: preview-edit desc btn */}
                {editDescription 
                ? <div className='font-trigger-1 mt-[10px] mb-[10px]' onClick={closeEditDescription}>Preview</div> 
                : <div className='font-trigger-1 mt-[10px] mb-[10px]' onClick={openEditDescription}>Edit</div>}
              </div>
              <div>
                <div className='text-[#3d77db] font-bold' onClick={()=>setOpenMarkdownDialog(true)}>Syntax</div>
                {/* //todo: upload btn */}
                {editDescription && 
                  <div className='mt-[10px]'>
                    <>
                      {
                        !uploadImageLoading 
                        ? <>
                          <input type="file" className='hidden' id='upload-image' accept='image/jpeg, image/png' onChange={handleUploadImage} />
                          <label htmlFor='upload-image' className='font-trigger-1' onClick={handleUploadImage}>Upload</label>
                        </>
                        : <Spinner />
                      }
                    </>
                  </div>
                }
              </div>
            </div>
            <hr />

            {/* //TODO Show uploaded image list */}
            {editDescription && 
              <div className='flex w-[100%] flex-wrap'>
                {account?.uploadImage?.map(image => {
                  return <ImageUploadedItem url={image} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
                })}
              </div>
            }
            {editDescription && <>
              <textarea value={partnerProfile?.description} type="description" name='description' onChange={handleChange} className='text-area-1  h-[250px]' placeholder='Viết mô tả' />
              <div className={isError?.email ? "error-input opacity-100" : "error-input"}>{}</div>
            </>}
          </form>

          {/* //TODO: description edit - preview */}
          {!editDescription &&
            <div className='w-[100%] mb-[30px]'>
              <MarkdownPreview 
                source={partnerProfile?.description} 
                wrapperElement={{
                    "data-color-mode": "light"
                }}
                components={{
                  h1(props) {
                    const {node, ...rest} = props
                    return <div className='h1' {...rest} />
                  },
                  h2(props) {
                    const {node, ...rest} = props
                    return <div className='h2' {...rest} />
                  }
                }}
              />
            </div>
          }
          {
            editDescription &&
            <>
            {editDescriptionLoading 
              ? <Spinner />
              : <button className='btn-1' onClick={handleSubmitDescription}>Cập nhật</button>
            }
            </>
          }
        </div>  
      </div>
    </div>
  )
}

export default PartnerProfile