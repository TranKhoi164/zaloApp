import React, {useEffect, useState} from 'react'
import { NotificationApi } from '../api/notificationApi'
import NotificationArticle from '../components/article/NotificationArticle'
import { Spinner, useSnackbar } from 'zmp-ui'
import { queryUrlServer } from '../utils/stringFunc'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRecoilValue } from 'recoil'
import { accountState } from '../State'
import { notificationsPerPage } from '../utils/perPage'


function Notification() {
  const account = useRecoilValue(accountState)
  const {openSnackbar} = useSnackbar()
  const [notifications, setNotifications] = useState([])
  const [hasMoreNotis, setHasMoreNotis] = useState(true)
  const {getNotificationsApi, updateNotificationsApi} = NotificationApi()
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const perPage = notificationsPerPage

  useEffect(() => {
    getNotifications({roleOfReceiver: account?.role=='admin'&&'admin', to: account?.role == 'admin' ? '' : account?._id, page: 1, sort: 1})
  }, [])
  
  useEffect(() => {
    getNotifications({roleOfReceiver: account?.role=='admin'&&'admin', to: account?.role == 'admin' ? '' : account?._id, page: page, sort: 1})
  }, [page])

  const getNotifications = async (searchObj) => {
    try {
      setIsLoading(true)
      let temp = {...searchObj}
      const query = queryUrlServer(temp)
      //const temp = products.concat(productsReq)

      getNotificationsApi(query)
      .then(data => {
        console.log('test: ', data?.notifications?.length+10% perPage  == 0);
        if (data?.notifications?.length < perPage) {
          setHasMoreNotis(false)
        } 

        setNotifications([...notifications, ...data?.notifications])
        const idsArr = data?.notifications?.map(noti => noti?._id)
        
       
        updateNotificationsApi({ids: idsArr, isSeen: true})
        .then(data=>console.log(data?.message))
        setIsLoading(false)
      }).catch(e => {
        setIsLoading(false)
        openSnackbar({
          type: 'error',
          text: e?.message
        })
        throw new Error(e)
      })
    } catch(e) {
      setIsLoading(false)
      openSnackbar({
        type: 'error',
        text: e?.message
      })
      throw new Error(e)
    } 
  }

  console.log('page: ', page);

  return (
    <div className='mb-[100px] flex flex-col items-center'>
      <div className='h1 text-center'>Thông báo</div>
      {/* <div className='flex justify-center'>{getNotisLoading && <Spinner /> }</div> */}
      {/* {notifications?.map(noti => {
        return <NotificationArticle noti={noti} />
      })} */}
      {/* //TODO: notis list */}
      <div >
        {notifications?.map(noti => {
          return <NotificationArticle noti={noti} />
        })}
      </div>
      {/* //TODO: loading btn */}
      {isLoading 
      ? <Spinner />
      : <> {hasMoreNotis 
        ? <button className='btn-1 mt-[20px] w-[50%] bg-transparent border-black border-[1px] text-black' onClick={()=>setPage(page+1)}>Xem thêm</button> 
        : <div className='mt-[20px]'>-- hết --</div>}
        </>
      }
    </div>
  )
}

export default Notification