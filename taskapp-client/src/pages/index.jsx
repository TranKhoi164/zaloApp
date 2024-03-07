import React, {useState, useEffect} from 'react'
import { BottomNavigation, useNavigate, Icon, Page, Spinner, useSnackbar } from "zmp-ui";
import '../css/app.css'
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState } from '../State';
import { AccountApi } from '../api/accountApi';
import PartnerArticle from '../components/article/PartnerArticle';
import SearchPartnersPopup from '../components/popup/SearchPartnersPopup';
import { queryUrlServer } from '../utils/stringFunc';
import { accountsPerpage } from '../utils/perPage';
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis';

function HomePage() {
  // const navigate = useNavigate()
  const {openSnackbar} = useSnackbar()
  const [account, setAccount] = useRecoilState(accountState)
  const {getAccountsInforApi, loginZaloProfileApi, loginZaloPhoneNumberApi} = AccountApi()
  const [partners, setPartners] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [openSearch, setOpenSearch] = useState()
  const [searchObj, setSearchObj] = useState({
    verified: 'true',
    partnerName: '',
    phoneNumber: '',
    services: '',
    location: '',
  })
  const [isFinding, setIsFinding] = useState(false)
  const perPage = accountsPerpage

  useEffect(() => {
    loadPartners(1)
  }, [])
  console.log('account: ', account)
  
  const loadPartners = async (page, isFirstPage) => {
    setIsLoading(true)
    setIsFinding(true)
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
    <div>
      <div className='flex justify-end mt-[10px]'>
        <button className='btn-1 f w-[30px] h-[30px] bg-blue-500' onClick={()=>setOpenSearch(true)}><Icon icon='zi-search' /></button>
      </div>
      {openSearch && <div className='mt-[10px]'><SearchPartnersPopup isFinding={isFinding} loadPartners={loadPartners} setCurrentPage={setCurrentPage} setHasMore={setHasMore} setOpenSearch={setOpenSearch} searchObj={searchObj} setSearchObj={setSearchObj} /></div>}
    
      {partners?.map(partner => {
        return <div className='flex justify-center mt-[20px]'>
        <PartnerArticle key={partner?._id} partner={partner} />
        </div>
      })}

      <div className='mt-[30px] flex justify-center mb-[100px]'>
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

export default HomePage