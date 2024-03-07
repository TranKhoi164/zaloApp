import React, {useState} from 'react'
import { getDateByTimeStamps, getDateIosString, getTimeIosString, objectToString } from '../../utils/stringFunc';
import {useNavigate, useSnackbar} from 'zmp-ui'
import OrderDialog from '../dialog/OrderDialog';
import { OrderApi } from '../../api/orderApi';
import { useRecoilValue } from 'recoil';
import { accountState } from '../../State';
import { NotificationApi } from '../../api/notificationApi';
import { partnerChangeOrderStatusBody, partnerChangeOrderStatusTitle, userChangeOrderStatusTitle, userChangeOrderStatusBody } from '../../utils/notification';

function OrderArticle({orders, setOrders, order, role}) {
  const [openDialog, setOpenDialog] = useState(false)
  const {updateOrderApi} = OrderApi()
  const {openSnackbar} = useSnackbar()
  const account = useRecoilValue(accountState)
  const {createNotificationApi} = NotificationApi()
  
  const orderState1 = 'Chờ'
  const orderState2 = 'Xác nhận'
  const orderState3 = 'Đã xong'
  const orderState4 =  'Hủy'

  const updateOrder = async (updateData) => {
    let orStatus = ''
    switch (updateData?.status) {
      case 'await':
        orStatus = orderState1
        break;
      case 'active':
        orStatus = orderState2
        break;
      case 'complete':
        orStatus = orderState3
        break;
      case 'inactive':
        orStatus = orderState4
        break;
      default:
        break;
    }

    console.log(updateData);


    if (account?._id === order?.partner?._id) {
      await createNotificationApi({
        title: partnerChangeOrderStatusTitle(order?._id, account?.partnerName, orStatus), 
        body: partnerChangeOrderStatusBody(order?._id, account?.partnerName, orStatus),
        to: order?.user?._id,
        sender: account?._id})
    } else if (account?._id === order?.user?._id) {
      await createNotificationApi({
        title: userChangeOrderStatusTitle(order?._id, account?.fullName, orStatus), 
        body: userChangeOrderStatusBody(order?._id, account?.fullName, orStatus),
        to: order?.partner?._id,
        sender: account?._id})
    }

    updateOrderApi({order_id: order?._id, ...updateData})
    .then(data => {
      openSnackbar({
        text: data?.message,
        type: 'success'
      })
      const newOrders = orders?.filter(el => el?._id != order?._id)
      setOrders(newOrders)
    }).catch(e => {
      openSnackbar({
        text: e?.message,
        type: 'error'
      })
    })
  }

  console.log(role);

  return (
    <>
    {openDialog && <OrderDialog order={order} setOpenDialog={setOpenDialog} />}
    <div className='relative flex flex-col justify-between bg-white min-h-[100px] mt-[20px]'>
      <div className='ml-[10px] text-[13px] mt-[5px] text-[#686868]'><span>Mã: </span>{order?._id}</div>
      <div className='mt-[10px] max-w-[85%] ml-[10px]'>
        <div onClick={()=>setOpenDialog(true)}>
          <div><span className='strong-1'>Khách: </span>{order?.userName}</div>
          <div><span className='strong-1'>Sđt: </span>{order?.phoneNumber}</div>
          <div><span className='strong-1'>Đơn vị tiếp nhận: </span>{order?.partner?.partnerName}</div>
          <div><span className='strong-1'>Dịch vụ: </span>{order?.service?.name}</div>
          <div><span className='strong-1'>Thời gian: </span>{order?.date}</div>
          <div><span className='strong-1'>Địa chỉ:</span> {objectToString({a: order?.address?.address, b: order?.address?.ward, c: order?.address?.district, d: order?.address?.province})}</div>
        
        </div>
      </div>
      <div className='mt-[20px] ml-[10px] mr-[10px] mb-[10px] strong-2 flex justify-between'>
          <div>{getDateByTimeStamps(order?.createdAt)} <span className='ml-[5px]'>{getTimeIosString(order?.createdAt)}</span></div>
          <div className='flex'>
            {role === 'partner' && account?._id === order?.partner?._id && <>
            {order?.status == 'await' && <div onClick={()=>updateOrder({status:'active', role: role})} className='strong-1 text-blue-500 ml-[10px]'>Xác nhận</div>}
            {order?.status == 'active' && <div onClick={()=>updateOrder({status:'await', role: role})} className='ml-[10px] strong-1 text-blue-500'>Chờ</div>}
            {order?.status == 'active' && <div onClick={()=>updateOrder({status:'complete', role: role})} className='ml-[10px] strong-1 text-blue-500'>Xong</div>}
            {order?.status == 'complete' && <div onClick={()=>updateOrder({status:'await', role: role})} className='ml-[10px] strong-1 text-blue-500'>Chờ</div>}
            {order?.status == 'complete' && <div onClick={()=>updateOrder({status:'active', role: role})} className='ml-[10px] strong-1 text-blue-500'>Xử lý</div>}
            {order?.status == 'inactive' && <div onClick={()=>updateOrder({status:'await', role: role})} className='ml-[10px] strong-1 text-blue-500'>Chờ</div>}
            {order?.status == 'inactive' && <div onClick={()=>updateOrder({status:'active', role: role})} className='ml-[10px] strong-1 text-blue-500'>Xử lý</div>}
            </>}
          </div>
        </div>
      {order?.status !== 'inactive' && <div className='absolute mt-[10px] right-0 mb-[10px] mr-[10px]'>
        <div className='strong-1 text-blue-500' onClick={()=>updateOrder({status:'inactive', role: role})}>Hủy</div>
      </div>}
    </div>
    </>
  )
}

export default OrderArticle