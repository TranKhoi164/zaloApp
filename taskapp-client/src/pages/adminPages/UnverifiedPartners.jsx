import React, {useEffect, useState} from 'react'
import { AccountApi } from '../../api/accountApi'
import { Spinner, useSnackbar, useNavigate, Icon } from 'zmp-ui'
import UseDebounce from '../../utils/UseDebounce'
import PartnerPreviewArticle from '../../components/article/PartnerPreviewArticle'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isNewUnverifiedPartner, isNewVerifiedPartner } from '../../State'
import { accountsPerpage } from '../../utils/perPage'
import { queryUrlServer } from '../../utils/stringFunc'
import SearchPartnersPopup from '../../components/popup/SearchPartnersPopup'
import UnverifiedPartnerArticle from '../../components/article/UnverifiedPartnerArticle'

function UnverifiedPartners() {
  const [newVerifiedPartner, setNewVerifiedPartner] = useRecoilState(isNewVerifiedPartner)
  const navigate = useNavigate()
  const debounce = UseDebounce()
  const setIsNewUnverifiedPartner = useSetRecoilState(isNewUnverifiedPartner)
  const {verifyPartnerApi, getAccountsInforApi, deletePartnerApi} = AccountApi()
  const {openSnackbar} = useSnackbar()
  const [partners, setPartners] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [openSearch, setOpenSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchObj, setSearchObj] = useState({
    verified: 'false',
    partnerName: '',
    phoneNumber: '',
    services: '',
    location: '',
  })
  const perPage = accountsPerpage
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isFinding, setIsFinding] = useState(false)


  useEffect(() => {
    loadPartners(1)
    setIsNewUnverifiedPartner(false)
  }, [])

  const loadPartners = async (page, isFirstPage) => {
    setIsFinding(true)
    setIsLoading(true)
    getAccountsInforApi(queryUrlServer({...searchObj, page: page, role: 'partner'}))
    .then(data => {
      setIsFinding(false)
      setIsLoading(false)
      if (data?.accounts?.length < perPage || !data?.accounts) {
        setHasMore(false)
      }
      if (isFirstPage) {
        setPartners([...data?.accounts])
        return
      }
      setPartners([...partners, ...data?.accounts])

    }).catch(e => {
      setIsFinding(false)
      setIsLoading(false)
      openSnackbar({
        type: 'error',
        text: e?.message,
      })
    })
  }
  
  

  return (
    <div className='container-1'>
      <div className='box-1 w-[95%] p-0 mt-[20px] relative'>
        {/* //todo: navigate to verified partner */}
        {/* {checkedService?.length>0&&<div className='absolute top-[5px] right-[5px] text-red-500'><Icon icon='zi-delete' onClick={deleteServices} /></div>} */}
        <div className='h1' onClick={()=>navigate('/verified_partners')}>Đơn vị đã xác nhận {newVerifiedPartner && <span className='pl-[6px] pr-[6px] bg-blue-500 rounded-xl font-bold text-[20px]'>!</span>}</div>

      </div>

      <div className='h1'>Đơn vị chờ xác nhận</div>
      <div className='flex justify-end mt-[10px] w-[100%]'>
        <button className='btn-1 f w-[30px] h-[30px] bg-blue-500' onClick={()=>setOpenSearch(true)}><Icon icon='zi-search' /></button>
      </div>
      {openSearch && <div className='mt-[10px]'><SearchPartnersPopup isFinding={isFinding} setHasMore={setHasMore} loadPartners={loadPartners} setOpenSearch={setOpenSearch} searchObj={searchObj} setSearchObj={setSearchObj} /></div>}
      {partners?.map(partner => {
        return <UnverifiedPartnerArticle partner={partner} partners={partners} setPartners={setPartners} />
      })}

      <div className='mt-[10px] flex justify-center mb-[100px]'> 
      {isLoading 
        ? <Spinner visible /> 
        : <div>
          {!hasMore 
          ? <div className='mt-[30px] flex justify-center'>--  Hết --</div>
          : <>
              <button onClick={()=>{loadPartners(currentPage+1); setCurrentPage(currentPage+1)}} className='btn-3 pl-[10px] pr-[10px] border-blue-500 text-blue-500'>Xem thêm</button>
            </>
          }
        </div>
      }
      </div>
    </div>
  )
}

export default UnverifiedPartners