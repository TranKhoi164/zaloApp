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
    <div>
      <div className='h1 text-center mb-[30px] mt-[30px]'>Đơn vị yêu thích</div>
      {partners?.map(partner => {
        return <div className='flex justify-center mt-[20px]'>
          <PartnerArticle key={partner?._id} partner={partner} />
        </div>
      })}
      {partners?.length == 0 && <div className='mt-[30px] flex justify-center'>--  Hết --</div>}
    </div>
  )
}

export default FavouritePartners