import React, {useState} from 'react'
import Avatar from 'react-avatar-edit'
import EditAvatarModal from './EditAvatarModal'
import { AccountApi } from '../../api/accountApi'
import { Spinner, useSnackbar } from 'zmp-ui'
import { UploadApi } from '../../api/uploadApi'
import CropImageDialog from '../dialog/CropImageDialog'

function AvatarUpdate({account, setAccount}) {
  const {openSnackbar} = useSnackbar()
  const [image, setImage] = useState(account?.avatar)
  const [isLoading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [aspect, setAspect] = useState(1/1)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log(file?.size)

    if (file.size > 10e5) {
      openSnackbar({
        text: "File phải có kích thước dưới 1MB",
        type: 'warning'
      })
      return
    }

    setOpenDialog(true)
    setImage(URL.createObjectURL(file))
  }

  return (
    <div>
      <div className='absolute top-0 right-0 w-[100vw] h-[100%]'>
        {openDialog && <CropImageDialog aspect={aspect} image={image} setImage={setImage} setOpenDialog={setOpenDialog} type='avatar' />}
      </div>
      <div className='flex justify-center'>
        {
          isLoading 
          ? <div className='flex justify-center'><Spinner visible /></div>
          : <div className='relative'>
            <img src={account?.avatar} alt="avatar" className="w-[150px] avatar-1"/>
            <input onChange={handleImageChange} className='hidden' type="file" id='file_up' name='file' accept='image/png, image/jpeg' />
            <label htmlFor='file_up' className='w-[150px] h-[150px] top-0 absolute' ></label>
          </div>
        }
      </div>
    </div>
  )
}

export default AvatarUpdate