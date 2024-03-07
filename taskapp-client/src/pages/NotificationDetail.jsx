import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotificationApi } from '../api/notificationApi'
import MarkdownPreview from '@uiw/react-markdown-preview';
import MarkdownContent from '../components/MarkdownContent';
import { Page, useSnackbar } from 'zmp-ui';


function NotificationDetail() {
  const {notification_id} = useParams()
  const {getNotificationApi} = NotificationApi()
  const [notification, setNotification] = useState({})
  const {openSnackbar} = useSnackbar()

  useEffect(() => {
    getNotificationApi({notification_id: notification_id})
    .then(data => {
      setNotification(data?.notification)
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
      throw new Error(e)
    }) 
  }, [])

  

  return (
    <div className='box-1'>
      <MarkdownContent title={notification?.title} content={notification?.body} />
    </div>
  )
}

export default NotificationDetail