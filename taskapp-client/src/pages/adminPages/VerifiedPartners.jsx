import React, {useState, useEffect, useRef} from 'react'
import { AccountApi } from '../../api/accountApi'
import { Icon, Spinner, useNavigate, useSnackbar } from 'zmp-ui'
import UseDebounce from '../../utils/UseDebounce'
import PartnerPreviewArticle from '../../components/article/PartnerPreviewArticle'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isNewUnverifiedPartner, isNewVerifiedPartner } from '../../State'
import PartnerArticle from '../../components/article/PartnerArticle'
import { queryUrlServer } from '../../utils/stringFunc'
import { accountsPerpage } from '../../utils/perPage'
import SearchPartnersPopup from '../../components/popup/SearchPartnersPopup'
import VerifiedPartnerArticle from '../../components/article/VerifiedPartnerArticle'


function VerifiedPartners() {
  const [newUnverifiedPartners, setNewUnverifiedPartners] = useRecoilState(isNewUnverifiedPartner)
  const setIsNewVerifiedPartners = useSetRecoilState(isNewVerifiedPartner)
  const {openSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const debounce = UseDebounce()
  const {cancelVerificationPartnerApi, getAccountsInforApi, deletePartnerApi} = AccountApi()
  const [partners, setPartners] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [openSearch, setOpenSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchObj, setSearchObj] = useState({
    verified: 'true',
    partnerName: '',
    phoneNumber: '',
    services: '',
    location: '',
  })
  const perPage = accountsPerpage
  const [isFinding, setIsFinding] = useState(false)
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)

  useEffect(() => {
    loadPartners(1)
    setIsNewVerifiedPartners(false)
  }, [])

  const loadPartners = async (page, isFirstPage) => {
    setIsLoading(true)
    setIsFinding(true)
    getAccountsInforApi(queryUrlServer({...searchObj, page: page, role: 'partner'}))
    .then(data => {
      setIsLoading(false)
      setIsFinding(false)
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
        {/* //todo: navigate to unverified partner */}
        {/* {checkedService?.length>0&&<div className='absolute top-[5px] right-[5px] text-red-500'><Icon icon='zi-delete' onClick={deleteServices} /></div>} */}
        <div className='h1' onClick={()=>navigate('/unverified_partners')}>Đơn vị chờ xác nhận {newUnverifiedPartners&&<span className='badge-1'>!</span>}</div>

      </div>
      
      <div className='container-1 w-[100%]'>
        {/* {checkedService?.length>0&&<div className='absolute top-[5px] right-[5px] text-red-500'><Icon icon='zi-delete' onClick={deleteServices} /></div>} */}
        <div className='h1'>Đơn vị hoạt động</div>

        <div className='flex justify-end mt-[10px] w-[100%]'>
          <button className='btn-1 f w-[30px] h-[30px] bg-blue-500' onClick={()=>setOpenSearch(true)}><Icon icon='zi-search' /></button>
        </div>
        {openSearch && <div className='mt-[10px]'><SearchPartnersPopup setHasMore={setHasMore} loadPartners={loadPartners} setOpenSearch={setOpenSearch} searchObj={searchObj} isFinding={isFinding} setSearchObj={setSearchObj} /></div>}

        <div className='w-[100%] flex flex-col items-center mt-[20px]'>
            {partners?.map(partner => {
              return <>
                <VerifiedPartnerArticle partner={partner} partners={partners} setPartners={setPartners} />
              </>
            })}
        </div>
      </div>

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

export default VerifiedPartners