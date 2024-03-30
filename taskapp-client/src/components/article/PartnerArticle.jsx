import React from 'react'
import Chip from '../ChipComponent';
import { stringListDash } from '../../utils/stringFunc';
import { Icon, useNavigate } from 'zmp-ui';


function PartnerArticle({partner}) {
  const navigate = useNavigate()

  const navigateToPartnerDetail = () => {
    navigate('/partner_detail/'+partner?._id)
  }

  return (
    <div className='partner-article-1 box-shadow-1 justify-center flex-col pb-[5px]' onClick={navigateToPartnerDetail}>
      <img src={partner?.cover} className='w-[100%] h-[130px] object-cover' alt="" />
      <div className='w-[95%] flex align-center flex-col mt-[5px]'>
        <div className='flex items-center border-b-[1px] border-[#d2d2d2] border-dashed w-[100%] mt-[5px] pb-[10px]'>
          <img className='w-[60px] rounded-lg border-[1px] border-[#e9e9e9]' src={partner?.avatar} alt="avatar" />
          <div className='ml-[10px] h2'>{partner?.partnerName}</div>
        </div>
        <div className='h3 text-[#4d4d4d] mt-[10px] flex'>
          <Icon icon='zi-location' />
          <div className='leading-5 ml-[5px]'>
            {stringListDash(partner?.location)}
          </div>
        </div>
        <div className='mt-[10px] mb-[2px] flex text-[#4d4d4d] items-center flex-wrap'>
           {partner?.services?.map(el => {
            return <Chip key={el?._id} el={el?.name} />
          })}
        </div>
      </div>
    </div>
  )
}

export default PartnerArticle