import React, { useState, useEffect } from 'react'
import { Icon } from 'zmp-ui';

function ImageListDialog({imageList, setImageListDialog}) {
  const [currentImage, setCurrentImage] = useState(0)

  const closeDialog = () => {
    setImageListDialog(false)
  }

  const goLeft = () => {
    if (currentImage == imageList?.length - 1) {
      setCurrentImage(0)
      return
    }
    setCurrentImage(currentImage+1)
  }
  const goRight = () => {
    if (currentImage == 0) {
      setCurrentImage(imageList?.length - 1)
      return
    }
    setCurrentImage(currentImage-1)
  }

  return (
    <div className='dialog-1'>
      <div className="container-1">
        <div onClick={closeDialog} className='mt-[20px] text-red-400 font-bold w-[90%] text-[20px] flex justify-end'>X</div>
        <div className='w-[100%] mt-[50px] flex justify-center items-center'>
          <Icon icon='zi-chevron-left' onClick={goLeft} />
          <div className='flex justify-center w-[85%]'>
            <img src={imageList?.at(currentImage)} alt="image" className='h-[200px] object-contain' />
          </div>
          <Icon icon='zi-chevron-right' onClick={goRight} />
        </div>
        <div className='mt-[20px] flex-wrap'>
          {imageList?.map(el => {
            return <>
              <img key={el} src={el} alt="img" className={el==imageList?.at(currentImage)?'image-list-1 border-[1px] border-black p-1':'image-list-1'}/>
            </>
          })}
        </div>
      </div>
    </div>
  )
}

export default ImageListDialog