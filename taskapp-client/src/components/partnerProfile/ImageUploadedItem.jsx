import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Icon, useSnackbar } from 'zmp-ui'
import { UploadApi } from '../../api/uploadApi'
import { useRecoilState } from 'recoil'
import { accountState } from '../../State'
import { AccountApi } from '../../api/accountApi'

function ImageUploadedItem({url}) {
  const [account, setAccount] = useRecoilState(accountState)
  const {updateBasicApi} = AccountApi()
  const {openSnackbar} = useSnackbar()
  const {deleteImageApi} = UploadApi()

  const deleteImageItem = () => {
    const urlArr = url?.split('/')
    const img = urlArr[urlArr?.length - 1]
    const imgName = img?.split('.')[0]

    deleteImageApi({imageName: imgName})
    .then(async data => {
      openSnackbar({
        text: data?.message,
        type: 'success'
      })
      const newUploadImageList = account?.uploadImage?.filter(img => img !== url)
      setAccount({...account, uploadImage: newUploadImageList})
      const updateUploadImg = await updateBasicApi({uploadImage: newUploadImageList})
      console.log('message: ', updateUploadImg?.message);
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
  }
  
  const handleCopy = () => {
    openSnackbar({
      type: 'success',
      text: 'Copy thành công!'
    })
  }

  return (
    <div className='list-item-2 relative'>
      <span className='absolute top-0 text-white bg-black ' onClick={deleteImageItem}><Icon icon="zi-close" /></span>
      <img src={url} alt='items' style={{height: '70px'}}  />
      <CopyToClipboard text={url} onCopy={handleCopy}>
        <div className='w-[50px] flex justify-center items-center'>Copy</div>
      </CopyToClipboard>
    </div>
  )
}

export default ImageUploadedItem