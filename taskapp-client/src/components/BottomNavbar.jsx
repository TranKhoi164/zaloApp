import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BottomNavigation, useNavigate, Icon, Page } from "zmp-ui";
import { accountState, activeTabState } from "../State";

const BottomNavbar = () => {
  const navigate = useNavigate()


  //home, cooperation, , auth, notification, orders, partnerManagement
  const [activeTab, setActiveTab] = useRecoilState(activeTabState)
  const account = useRecoilValue(accountState)
  
  const checkLoggedAccount = () => {
    return Object.keys(account).length > 0
    // &&account.verified
  }

  console.log(account);




  //tab: home cooperation
  const nonLoggedInUserNavbar = () => {
    return <>
      <BottomNavigation.Item
          key="home"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
          onClick={() => {
            setActiveTab('home')
            navigate('/')
            return
          }}
        />
        <BottomNavigation.Item
          key="cooperation"
          label="Hợp tác"
          icon={<Icon icon="zi-user-window-solid" />}
          activeIcon={<Icon icon="zi-user-window-solid" />}
          onClick={() => {
            setActiveTab('cooperation')
            if (Object.keys(account)?.length === 0) {
              navigate('/partner_register')
              return
            } 
            navigate('/notfound')
          }}
        />
        <BottomNavigation.Item
          key="auth"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
          onClick={() => {
            setActiveTab('auth')
            if (Object.keys(account)?.length === 0) {
              navigate('/dashboard')
              return
            } 
            navigate('/dashboard')
          }}
        />
    </>
  }






  const userNavbar = () => {
    return <>
        <BottomNavigation.Item
          key="home"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
          onClick={() => {
            setActiveTab('home')
            navigate('/')
            return
          }}
        />
        <BottomNavigation.Item
          key="cooperation"
          label="Hợp tác"
          icon={<Icon icon="zi-user-window-solid" />}
          activeIcon={<Icon icon="zi-user-window-solid" />}
          onClick={() => {
            setActiveTab('cooperation')
            navigate('/partner_register')
          }}
        />
        {/* <BottomNavigation.Item
          key="notification"
          label="Thông báo"
          icon={<Icon icon="zi-notif" />}
          activeIcon={<Icon icon="zi-notif" />}
          onClick={() => {
            setActiveTab('notification')
            navigate('/notification')
            return
          }}
        /> */}
        <BottomNavigation.Item
          key="auth"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
          onClick={() => {
            setActiveTab('auth')
            navigate('/dashboard')
          }}
        />
    </>
  }






  const partnerNavbar = () => {
    return <>
        <BottomNavigation.Item
          key="home"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
          onClick={() => {
            setActiveTab('home')
            navigate('/')
            return
          }}
        />


        {(account?.role =='user' || account?.role == undefinde) && 
        <BottomNavigation.Item
          key="cooperation"
          label="Hợp tác"
          icon={<Icon icon="zi-user-window-solid" />}
          activeIcon={<Icon icon="zi-user-window-solid" />}
          onClick={() => {
            setActiveTab('cooperation')
            navigate('/partner_register')
          }}
        />}


        {account?.phoneNumber?.length != 0 && 
        <>
        <BottomNavigation.Item
          key="orders"
          label="Đơn"
          icon={<Icon icon="zi-user-window-solid" />}
          activeIcon={<Icon icon="zi-user-window-solid" />}
          onClick={() => {
            setActiveTab('orders')
            navigate('/my_orders/partner')
            return
          }}
        /   >
        </>}
        {/* <BottomNavigation.Item
          key="notification"
          label="Thông báo"
          icon={<Icon icon="zi-notif" />}
          activeIcon={<Icon icon="zi-notif" />}
          onClick={() => {
            setActiveTab('notification')
            navigate('/notification')
            return
          }}
        /> */}
        <BottomNavigation.Item
          key="auth"
          label="Partner"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
          onClick={() => {
            setActiveTab('auth')
            navigate('/dashboard')
          }}
        />
    </>
  }





  const adminNavbar = () => {
    return <>
      <BottomNavigation.Item
        key="home"
        label="Trang chủ"
        icon={<Icon icon="zi-home" />}
        activeIcon={<Icon icon="zi-home" />}
        onClick={() => {
          setActiveTab('home')
          navigate('/')
          return
        }}
      />
      <BottomNavigation.Item
        key="partnerManagement"
        label="Đơn vị"
        icon={<Icon icon="zi-group" />}
        activeIcon={<Icon icon="zi-group" />}
        onClick={() => {
          setActiveTab('partnerManagement')
          navigate('/verified_partners')
          return
        }}
      />
      {/* <BottomNavigation.Item
        key="notification"
        label="Thông báo"
        icon={<Icon icon="zi-notif" />}
        activeIcon={<Icon icon="zi-notif" />}
        onClick={() => {
          setActiveTab('notification')
          navigate('/notification')
          return
        }}
      /> */}
      <BottomNavigation.Item
        key="auth"
        label="Admin"
        icon={<Icon icon="zi-user" />}
        activeIcon={<Icon icon="zi-user-solid" />}
        onClick={() => {
          setActiveTab('auth')
          navigate('/dashboard')
        }}
      />
    </>
  }
  
  return (
    <div>
      <BottomNavigation
        fixed
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <BottomNavigation.Item
          key="home"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
          onClick={() => {
            setActiveTab('home')
            navigate('/')
            return
          }}
        />
        {(account?.role =='user' || !account?.role) && 
        <BottomNavigation.Item
          key="cooperation"
          label="Hợp tác"
          icon={<Icon icon="zi-user-window-solid" />}
          activeIcon={<Icon icon="zi-user-window-solid" />}
          
          onClick={() => {
            setActiveTab('cooperation')
            navigate('/partner_register')
          }}
        />}


        {account?.role == 'partner' && 
        <BottomNavigation.Item                   
          key="orders"
          label="Đơn"
          icon={<Icon icon="zi-inbox" />}
          activeIcon={<Icon icon="zi-inbox" />}
          onClick={() => {
            setActiveTab('orders')
            navigate('/my_orders/partner')
            return
          }}
        />}
        {account?.role == 'admin' &&
        <BottomNavigation.Item
          key="partnerManagement"
          label="Đơn vị"
          icon={<Icon icon="zi-group" />}
          activeIcon={<Icon icon="zi-group" />}
          onClick={() => {
            setActiveTab('partnerManagement')
            navigate('/verified_partners')
            return
          }}
        />}
        {/* <BottomNavigation.Item
          key="notification"
          label="Thông báo"
          icon={<Icon icon="zi-notif" />}
          activeIcon={<Icon icon="zi-notif" />}
          onClick={() => {
            setActiveTab('notification')
            navigate('/notification')
            return
          }}
        /> */}
        <BottomNavigation.Item
          key="auth"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
          onClick={() => {
            setActiveTab('auth')
            navigate('/dashboard')
          }}
        />
      </BottomNavigation>
    </div>
  );
};

export default BottomNavbar;