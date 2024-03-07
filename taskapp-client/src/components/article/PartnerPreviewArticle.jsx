import React from 'react'
import { stringListComma } from '../../utils/stringFunc'
import { useNavigate } from 'zmp-ui'

//for admin only
function PartnerPreviewArticle({partner}) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/partner_detail/'+partner?._id)
  }

  return (
    <>
      <div className='article-1 mt-[10px]' onClick={handleClick}>
        <div className='h-[80px] w-[80px]'><img src={partner?.avatar} alt="avatar" className='w-[100%] h-[100%]' /></div>
          <div className='h-[100%] ml-[10px] max-w-[75%] text-[#707070]'>
          <div className='mb-[10px]'>
            <div className='h2'>{partner?.partnerName}</div>
            <div><span className='font-bold'>Loại dịch vụ:</span> {stringListComma(partner?.services?.map(el=>el?.name))} </div>
            <div><span className='font-bold'>Email:</span> {partner?.email}</div>
            <div><span className='font-bold'>Người liên hệ:</span> {partner?.fullName}</div>
            <div><span className='font-bold'>Sđt:</span> {partner?.phoneNumber}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PartnerPreviewArticle