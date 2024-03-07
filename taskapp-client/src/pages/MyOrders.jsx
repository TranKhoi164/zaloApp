import React, { useEffect, useState } from 'react'
import { OrderApi } from '../api/orderApi'
import { queryUrlServer } from '../utils/stringFunc';
import OrderArticle from '../components/article/OrderArticle';
import { Icon, Spinner, useSnackbar } from 'zmp-ui';
import SearchOrdersPopup from '../components/popup/SearchOrdersPopup';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accountState } from '../State';
import { ordersPerpage } from '../utils/perPage';

function MyOrders() {
  const {role} = useParams()
  const {openSnackbar} = useSnackbar()
  const account = useRecoilValue(accountState)
  const {getOrdersApi} = OrderApi()
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchObj, setSearchObj] = useState({
    userName: '',
    phoneNumber: '',
    service: '',
    date: '',
    location: '',
  })
  const perPage = ordersPerpage
  

  // useEffect(() => {
  //   const query = queryUrlServer({sort: 1, status: 'await', page: 1})
  //   getOrdersApi(query)
  //   .then(data => {
  //     setOrders(data?.orders)
  //   }).catch(e => {
  //     throw new Error(e)
  //   })
  // }, [])

  useEffect(() => {
    loadOrders(1, true)
  }, [currentTab])

  // const loadFirstPageOrders = () => {
  //   let query = ''
  //   setOpenSearch(false)
  //   switch (currentTab) {
  //     case 1:
  //       query = queryUrlServer({...searchObj, status: 'await', page: 1})
  //       break;
  //     case 2:
  //       query = queryUrlServer({...searchObj, status: 'active', page: 1})
  //       break; 
  //     case 3:
  //       query = queryUrlServer({...searchObj, status: 'complete', page: 1})
  //       break;
  //     case 4:
  //       query = queryUrlServer({...searchObj, status: 'inactive', page: 1})
  //       break;

  //     default:
  //       break;
  //   }

  //   if (role == 'user') {
  //     query += 'user=' + account?._id
  //   } else if (role == 'partner') {
  //     query += 'partner=' + account?._id
  //   }
    
  //   setIsLoading(true)
  //   getOrdersApi(query)
  //   .then(data => {
  //     if (data?.orders?.length == 0 || data?.orders?.length % perPage != 0) {
  //       setHasMore(false)
  //     }
  //     setCurrentPage(1)
  //     setIsLoading(false)
  //     setOrders([...data?.orders])
  //   }).catch(e => {
  //     setIsLoading(false)
  //     console.log(e);
  //     openSnackbar({
  //       text: e?.message,
  //       type: 'error'
  //     })
  //   })
  // }

  const loadOrders = (page, isFirstPage) => {
    let query 
    switch (currentTab) {
      case 1:
        query = queryUrlServer({...searchObj, status: 'await', page: page})
        break;
      case 2:
        query = queryUrlServer({...searchObj, status: 'active', page: page})
        break; 
      case 3:
        query = queryUrlServer({...searchObj, status: 'complete', page: page})
        break;
      case 4:
        query = queryUrlServer({...searchObj, status: 'inactive', page: page})
        break;

      default:
        break;
    }
    if (role == 'user' || role == 'admin') {
      query += 'user=' + account?._id
    } else if (role == 'partner') {
      query += 'partner=' + account?._id
    }
    console.log(query);
    // console.log('query: ', queryUrlServer({...searchObj, status: 'await', page: page}));
    setIsLoading(true)
    getOrdersApi(query)
    .then(data => {
      if (data?.orders?.length < perPage) {
        setHasMore(false)
      }
      setIsLoading(false)
      if (isFirstPage) {
        setCurrentPage(1)
        setOpenSearch(false)
        setOrders([...data?.orders])
        return
      }
      setOrders([...orders, ...data?.orders])
    }).catch(e => {
      setIsLoading(false)
      console.log(e);
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  console.log('page: ', currentPage);
  console.log('order: ', orders);

  const changeTab = (tab) => {
    setSearchObj({})
    setHasMore(true)
    setCurrentTab(tab)
  }

  return (
    <div>
      <div className='navbar-1'>
        <div className={currentTab === 1 ? 'tab-1 selected-tab-1' : 'tab-1'} onClick={()=>changeTab(1)}>Chờ</div>
        <div className={currentTab === 2 ? 'tab-1 selected-tab-1' : 'tab-1'} onClick={()=>changeTab(2)}>Xử lý</div>
        <div className={currentTab === 3 ? 'tab-1 selected-tab-1' : 'tab-1'} onClick={()=>changeTab(3)}>Đã xong</div>
        <div className={currentTab === 4 ? 'tab-1 selected-tab-1' : 'tab-1'} onClick={()=>changeTab(4)}>Đã hủy</div>
      </div>

      <div>
        <div className='h1 flex justify-between items-center mt-[30px] mb-[30px]'>
          <div className='ml-[10px]'>Danh sách đơn</div>
          <button className='btn-1 f w-[30px] h-[30px] bg-blue-500' onClick={()=>setOpenSearch(true)}><Icon icon='zi-search' /></button>
        </div>
        {openSearch && <SearchOrdersPopup loadOrders={loadOrders} setHasMore={setHasMore} setCurrentPage={setCurrentPage} setIsLoading={setIsLoading} currentTab={currentTab} setOrders={setOrders} searchObj={searchObj} setSearchObj={setSearchObj} setOpenSearch={setOpenSearch} />}
        <div>
          {orders?.map(order => {
            return <OrderArticle key={order?._id} orders={orders} setOrders={setOrders} role={role} order={order} />
          })}
        </div>
        <div className='flex justify-center mb-[100px] mt-[20px]'>
          {isLoading 
          ? <Spinner visible /> 
          : <>
              {!hasMore 
                ? <div>-- Hết --</div>
                : <>
                  <button onClick={()=>{loadOrders(currentPage+1), setCurrentPage(currentPage+1)}} className='btn-3 pl-[10px] pr-[10px] border-blue-500 text-blue-500'>Xem thêm</button>
                </>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default MyOrders