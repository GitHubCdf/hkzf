// import { useState } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {AppstoreOutline,FileOutline,CompassOutline,UserCircleOutline} from 'antd-mobile-icons'

import News from './News'
import Home from './Home'
import House from './House'
import Profile from './Profile'

function Main() {
  
  return (
    <>
      <div className='main'>
      <Routes >
        <Route index element={<Home/>}></Route>
        <Route path="house" element={<House/>}></Route>
        <Route path="news" element={<News/>}></Route>
        <Route path="profile" element={<Profile/>}></Route>
      </Routes>
      </div>
      <div className='bottom'>
        <Bottom></Bottom>
      </div>
    </>
  )
}

function Bottom() {

  const {pathname} = useLocation()
  const navigate = useNavigate()
  
  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <AppstoreOutline/>
    },
    {
      key: '/house',
      title: '找房',
      icon: <CompassOutline/>
    },
    {
      key: '/news',
      title: '资讯',
      icon: <FileOutline/>
    },
    {
      key: '/profile',
      title: '我的',
      icon: <UserCircleOutline/>
    }
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => navigate(value)} >
      {
        tabs.map(tab => (
          <TabBar.Item key={tab.key} title={tab.title} icon={tab.icon}></TabBar.Item>
        ))
      }
    </TabBar>
  )
}

export default Main