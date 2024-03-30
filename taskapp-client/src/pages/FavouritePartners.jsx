import React, { useEffect, useState } from 'react'
import { AccountApi } from '../api/accountApi'
import { useRecoilValue } from 'recoil'
import { accountState } from '../State'
import PartnerArticle from '../components/article/PartnerArticle'
import { useSnackbar } from 'zmp-ui'

function FavouritePartners() {
  const {getFavouritePartnersApi} = AccountApi()
  const [partners, setPartners] = useState([])
  const account = useRecoilValue(accountState)
  const {openSnackbar} = useSnackbar()

  useEffect(() => {
    getFavouritePartnersApi({user_id: account?._id})
    .then(data => {
      setPartners(data?.favourite_partners)
    }).catch(e => {
      openSnackbar({
        error: 'error',
        text: e?.message
      })
    })
  }, [])
  
  console.log(partners);
  return (
    <div className='cover-2'>
      <div className='header-text-2'>Đơn vị yêu thích</div>
      <div className='container-3'>
        {partners?.map(partner => {
          return <div className='flex justify-center mt-[20px] w-[100%]'>
            <PartnerArticle key={partner?._id} partner={partner} />
          </div>
        })}
        {partners?.length == 0 && <div className='mt-[30px] flex justify-center'>--  Hết --</div>}
      </div>
    </div>
  )
}

export default FavouritePartners