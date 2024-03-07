import React, {useRef, useState} from 'react'
import {
  ReactCrop,
  centerCrop,
  makeAspectCrop
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCropImageBase64 } from '../../utils/cropper/getCropImageBase64'
import { UploadApi } from '../../api/uploadApi'
import { Spinner, useSnackbar } from 'zmp-ui'
import { useRecoilState } from 'recoil'
import { accountState } from '../../State'

function centerAspectCrop(
  mediaWidth,
  mediaHeight,
  aspect,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

function CropImageDialog({aspect, image, setImage, setOpenDialog, type}) {
  const [account, setAccount] =  useRecoilState(accountState)
  const {uploadImageBase64Api, deleteImageApi} = UploadApi()
  const {openSnackbar} = useSnackbar()
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [crop, setCrop] = useState(null)
  const [completedCrop, setCompletedCrop] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const refs = useRef()


  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
    setHeight(e?.currentTarget?.height)
    setWidth(e?.currentTarget?.width)
    setCompletedCrop({
      x: 0,
      y: 0,
      height: e?.currentTarget?.height,
      width: e?.currentTarget?.width,
      unit: 'px'
    })
  }

  const deleteImage = (imageUrl) => {
    const urlArr = imageUrl.split('/')
    const img = urlArr[urlArr?.length - 1]
    const imgName = img.split('.')[0]

    deleteImageApi({imageName: imgName})
    .then(data => {
      console.log('delete image: ', data?.message);
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
  }

  const uploadImage = async () => {
    setIsLoading(true)

    deleteImage(account?.avatar)
    const imgBase64 = await getCropImageBase64(refs.current, completedCrop)
    uploadImageBase64Api({type: type, image: imgBase64})
    .then(data => {
      openSnackbar({
        type: 'success',
        text: data?.message
      })
      console.log(data?.url);
      setAccount({...account, [type]: data?.url })
      setImage(data?.url)
      setOpenDialog(false)
      setIsLoading(false)
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  const closeDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div className='dialog-1'>
      <div className="container-1">
        <div onClick={closeDialog} className='mt-[20px] text-red-400 font-bold w-[90%] text-[20px] flex justify-end'>X</div>
        <div className="h1">Chọn vùng ảnh</div>
        <ReactCrop
          crop={crop}
          onChange={c => setCrop(c)} 
          aspect={aspect}
          onComplete={(e)=>{ 
            if (e.height == 0 || e.width == 0) {
              setCompletedCrop({
                x: 0,
                y: 0,
                height: height,
                width: 0,
                uit: 'px'
              })
            } else {
              setCompletedCrop(e)
            }
          }}
        >
          <img 
            src={image} 
            ref={refs}
            crossOrigin='anonymous'
            onLoad={onImageLoad} 
          />
        </ReactCrop>
        <div className='w-[30%] mt-[20px] mb-[100px]'>
          {isLoading 
          ? <div className='flex justify-center'><Spinner /></div>
          : <button className='btn-1 rounded' onClick={uploadImage}>Xác nhận</button>}
        </div>
        <div>
          {/* <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default CropImageDialog