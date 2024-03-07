import React, {useState, useEffect} from 'react'
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import HomePage from "../pages";

import Register from "../pages/authPages/Register";
import Login from "../pages/authPages/Login";
import ActiveAccountWithOtp from "../pages/authPages/ActiveAccountWithOtp";
import ForgotPassword from "../pages/authPages/ForgotPassword";
import ResetPasswordWithOtp from "../pages/authPages/ResetPasswordWithOtp";
import Notfound from "../pages/Notfound";
import Profile from '../pages/Profile';
import { useRecoilState } from 'recoil';
import { accountState } from '../State';
import BottomNavbar from './BottomNavbar';
import PartnerRegister from '../pages/authPages/PartnerRegister';
import ServiceManagement from '../pages/adminPages/ServiceManagement';
import { AccountApi } from '../api/accountApi';
import UnverifiedPartners from '../pages/adminPages/UnverifiedPartners';
import PartnerProfile from '../pages/partnerPages/PartnerProfile';
import PartnerDetail from '../pages/PartnerDetail';
import NotificationDetail from '../pages/NotificationDetail';
import VerifiedPartners from '../pages/adminPages/VerifiedPartners';
import MyOrders from '../pages/MyOrders';
import Dashboard from '../pages/Dashboard';
import Notification from '../pages/Notification';
import FavouritePartners from '../pages/FavouritePartners';

function Router() {
  const [account, setAccount] = useRecoilState(accountState)
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')

  const checkLoggedAccount = () => {
    return Object.keys(account).length!=0
  }
  
  // useEffect(() => {
  //   getPartnersInforApi({partnersType: 'all'})
  //   .then(data => {
  //     const verifiedPartnersArr = data.partners?.filter((partner) => partner?.verified == true)
  //     const unverifiedPartnersArr = data.partners?.filter((partner) => partner?.verified == false)
  //     setVerifiedPartners(verifiedPartnersArr)
  //     setUnverifiedPartners(unverifiedPartnersArr)
  //   })
  //   .catch(e => {
  //     throw new Error(e)
  //   })
  // }, [])
  

  return (
    <>
      <ZMPRouter>
        <AnimationRoutes>
          <Route path="/login" element={checkLoggedAccount()?<Notfound/>:<Login />}/>
          <Route path="/register" element={checkLoggedAccount()?<Notfound/>:<Register/>} />
          <Route path="/partner_register" element={<PartnerRegister/>} />
          <Route path="/active_account_with_otp" element={checkLoggedAccount()?<Notfound/>:<ActiveAccountWithOtp />} />
          <Route path="/forgot_password" element={checkLoggedAccount()?<Notfound />:<ForgotPassword setUserId={setUserId} email={email} setEmail={setEmail}/>} />
          <Route path="/reset_password_with_otp" element={checkLoggedAccount()?<Notfound/>:<ResetPasswordWithOtp userId={userId} email={email} />} />
          <Route path='/profile' element={checkLoggedAccount()?<Profile/>:<Notfound/>} />
          <Route path='/partner_detail/:partner_id' element={<PartnerDetail/>} />
          <Route path='/notification_detail/:notification_id' element={<NotificationDetail />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/my_orders/:role' element={<MyOrders />} />
          <Route path='/favourite_partners' element={<FavouritePartners />} />


          {/* adminRoutes */}
          <Route path='/service_management' element={checkLoggedAccount()&&account.role=='admin'?<ServiceManagement/>:<Notfound/>} />
          <Route path='/verified_partners' element={checkLoggedAccount()&&account.role=='admin'?<VerifiedPartners />:<Notfound />} />
          <Route path='/unverified_partners' element={checkLoggedAccount()&&account.role=='admin'?<UnverifiedPartners />:<Notfound />} />
          {/* <Route path='/admin_notification' element={checkLoggedAccount()&&account.role=='admin'?<Notification />:<Notfound />} /> */}

          {/* partnerRoutes */}
          <Route path='/partner/partner_profile' element={checkLoggedAccount()&&account.role=='partner'?<PartnerProfile/>:<Notfound/>} />
          <Route path='/partner/partner_orders' element={checkLoggedAccount()&&account.role=='partner'?<MyOrders />:<Notfound/>} />
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<Notfound />} />
        </AnimationRoutes>
        <BottomNavbar />
      </ZMPRouter>
    </>
  )
}

export default Router