import React, { useEffect } from 'react'
// import { Button, Page, Spinner, useNavigate, useSnackbar } from 'zmp-ui'
import { accountState } from '../State'
// import { AccountApi } from '../api/accountApi'
import BasicInforUpdate from '../components/profile/BasicInforUpdate'
import PasswordUpdate from '../components/profile/PasswordUpdate'
import { useRecoilState } from 'recoil'
import { getAccessToken, getPhoneNumber } from 'zmp-sdk/apis'
import { AccountApi } from '../api/accountApi'

// basic infor change: fullName, gender, avatar
function Profile() {
  const [account, setAccount] = useRecoilState(accountState)
  const {getAccountInforApi} = AccountApi()
  // const navigate = useNavigate()
  // const {openSnackbar} = useSnackbar()
  // const [isLoading, setIsLoading] = useState(false)
  // const {logoutApi} = AccountApi()

  // const triggerLogout = () => {
  //   logoutApi()
  //   .then(data => {
  //     openSnackbar({
  //       text: data.message,
  //       type: "success",
  //     });
  //     setAccount({})
  //     navigate('/')
  //     setIsLoading(false)
  //   }).catch(e => {
  //     openSnackbar({
  //       text: e?.message,
  //       type: "error",
  //     });
  //     setIsLoading(false)
  //   })
  // }
  

  return (
      <div className='flex items-center flex-col w-[100%] mb-[100px]'>
        <BasicInforUpdate account={account} setAccount={setAccount} />
      </div>
  )
}

export default Profile