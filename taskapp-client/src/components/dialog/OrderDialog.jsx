import React, { useState } from 'react'
import { getDateIosString, stringListDash } from '../../utils/stringFunc';
import { useRecoilValue } from 'recoil';
import { accountState } from '../../State';
import { OrderApi } from '../../api/orderApi';
import { Spinner, useSnackbar } from 'zmp-ui'

function OrderDialog({order, setOpenDialog}) {
  const account = useRecoilValue(accountState)
  const [partnerNote, setPartnerNote] = useState(order?.partnerNote || '')
  const {updateOrderApi} = OrderApi()
  const {openSnackbar} = useSnackbar()
  const [partnerNoteLoading, setPartnerNoteLoading] = useState(false)
  
  const closeDialog = () => {
    setOpenDialog(false)
  }

  const handleSubmitPartnerNote = (e) => {
    e.preventDefault()
    setPartnerNoteLoading(true)
    updateOrderApi({order_id: order?._id, partnerNote: partnerNote})
    .then((data) => {
      setPartnerNoteLoading(false)
      openSnackbar({
        text: data?.message,
        type: 'success'
      })
    }).catch(e => { 
      setPartnerNoteLoading(false)
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
  }

  console.log('order: ', order);


  return (
    <div className='dialog-1 flex flex-col items-center  pb-[100px]'>
      <div onClick={closeDialog} className='mt-[20px] text-red-400 font-bold w-[95%] text-[20px] flex justify-end'>X</div>
      <form className='form-1' onSubmit={handleSubmitPartnerNote}>
      <div>Ghi chú đơn vị</div>
        <textarea disabled={account?._id==order?.partner?._id ? '':'disabled'} className='text-area-1 mt-[5px] min-h-[100px] mb-[10px]' onChange={(e)=>setPartnerNote(e.target.value)} defaultValue={partnerNote}></textarea>
        {account?._id == order?.partner?._id && <>
          {partnerNoteLoading 
          ? <Spinner />
          : <button className='btn-1 w-[100px]'>Lưu</button>}
        </>}
        
        {/* //todo: about order */}
        <div className='h2 mb-[25px] mt-[25px]'>Đơn</div>

        <div>Dịch vụ</div>
        <input type="text" name='service' disabled className='text-input-1 mt-[5px] mb-[15px]' defaultValue={order?.service?.name} />

        <div>Thời gian</div>
        <input type="date" name='date' disabled value={order?.date} className='text-input-1 mt-[5px] mb-[15px]' />

        <div>Ghi chú khách hàng</div>
        <textarea className='text-area-1 mt-[5px] min-h-[100px] mb-[25px]' disabled defaultValue={order?.userNote}></textarea>

        {/* //todo: about partner */}
        <div className='h2 mb-[25px]'>Đơn vị tiếp nhận</div>

        <div>Đơn vị</div>
        <input type="text" name='partnername' disabled className='text-input-1 mt-[5px] mb-[15px]' defaultValue={order?.partner?.partnerName} />

        <div>Email</div>
        <input type="text" name='date' disabled value={order?.partner?.email} className='text-input-1 mt-[5px] mb-[15px]' />

        <div>Sđt</div>
        <input type="text" className='text-input-1 mt-[5px] mb-[15px]' disabled Value={order?.partner?.phoneNumber}/>
        
        <div>Vị trí</div>
        <input type="text" name='date' disabled value={stringListDash(order?.partner?.location)} className='text-input-1 mt-[5px] mb-[15px]' />
        
        {/* //todo: about customer */}
        <div className='h2 mb-[25px]'>Người dùng</div>

        <div>Họ tên</div>
        <input type="text" name='userName' disabled className='text-input-1 mt-[5px] mb-[15px]' value={order?.userName} />

        <div>Sđt</div>
        <input type="number" name='phoneNumber' disabled className='text-input-1 mb-[15px] mt-[5px]' value={order?.phoneNumber} />

        <div>Email</div>
        <input type="text" name='email' disabled className='text-input-1 mb-[15px] mt-[5px]' value={order?.email} />


        <div>Địa chỉ</div>
        <input type="text" name='province' disabled className='text-input-1 mt-[5px] mb-[5px]' value={order?.address?.province} />
        <input type="text" name='district' disabled className='text-input-1 mt-[5px] mb-[5px]' value={order?.address?.district} />
        <input type="text" name='ward' disabled className='text-input-1 mt-[5px] mb-[5px]' value={order?.address?.ward} />
        <input type="text" name='address' disabled className='text-input-1 mt-[5px] mb-[25px]' value={order?.address?.address} />

        {/* //todo: about user */}
        <div className='h2 mb-[25px]'>Người đặt</div>
        <div>Họ tên</div>
        <input type="text" name='userName' disabled className='text-input-1 mt-[5px] mb-[15px]' value={order?.user?.fullName || order?.userName} />

        <div>Sđt</div>
        <input type="number" name='phoneNumber' disabled className='text-input-1 mb-[15px] mt-[5px]' value={order?.user?.phoneNumber || order?.phoneNumber} />

        <div>Email</div>
        <input type="text" name='email' disabled className='text-input-1 mb-[15px] mt-[5px]' value={order?.user?.email || order?.email}/>
      </form>
    </div>
  )
}

export default OrderDialog