import React, { useEffect } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useNavigate } from 'zmp-ui';
import { getDateByTimeStamps, getDateIosString, getTimeIosString, watchMoreString } from '../../utils/stringFunc';

function NotificationArticle({noti}) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/notification_detail/'+noti?._id)
  }

  

  return (
    <> {/** 'h-[100%] ml-[10px] max-w-[100%]' */}
      <div className='article-1 mt-[10px] pb-[10px]' onClick={handleClick}>
        <div className={noti?.isSeen ? 'text-[#868686] mt-[10px]' : 'mt-[10px]'}>
          <div className={noti?.isSeen ? 'text-[#868686] mt-[10px]' : 'mt-[10px]'}>
            <div className='text-[20px] font-bold '>{watchMoreString(noti?.title, 60)}</div>
            <div className='w-[90%] mt-[10px] text-amber-950'>
              <MarkdownPreview
                source={watchMoreString(noti?.body, 100)}
                wrapperElement={{
                  "data-color-mode": "light"
                }}
                components={{
                  h1(props) {
                    const {node, ...rest} = props
                    return <div className='h1' {...rest} />
                  },
                  h2(props) {
                    const {node, ...rest} = props
                    return <div className='h2' {...rest} />
                  },
                  p(props) {
                    const {node, ...rest} = props
                    return <p className={noti?.isSeen ? 'text-[#868686]' : ''} {...rest} />
                  },
                }}
              />
            </div>
          </div>
          <div className='mt-[10px]'>
            {getDateByTimeStamps(noti?.createdAt)}
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationArticle