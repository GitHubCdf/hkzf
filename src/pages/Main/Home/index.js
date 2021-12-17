import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Swiper, Grid, List, Image } from 'antd-mobile'
import { KoubeiFill, TeamFill, LocationFill, EditSFill, DownOutline, EnvironmentOutline, SearchOutline } from 'antd-mobile-icons'


import { getSwiperItems, getGroups, getInformation } from '../../../request/home'
import { getCurrentLocation} from '../../../utils/index'
import './index.scss'


const baseUrl = 'http://microcun.cn:8080'
// swiper
const Swipers = () => {
  const [swiperItems, setSwiperItems] = useState([{ id: 1 }])
  useEffect(() => {
    getSwiperItems().then((res) => {
      setSwiperItems(res.data.body)
    })
  }, [])
  return (
    <Swiper Swiper autoplay loop >
      {
        swiperItems.map(item => (
          <Swiper.Item key={item.id}>
            <div className='content'>
              <Image alt="" src={`http://microcun.cn:8080${item.imgSrc}`}></Image>
            </div>
          </Swiper.Item>
        ))
      }
    </Swiper>
  )
}

// search location
const Search = () => {
  const navigate = useNavigate()
  const [city, setCity] = useState({label: '上海'})
  useEffect(() => {
    getCurrentLocation().then(res => setCity(res))
  }, [])

  return (
    <section className='search'>
      <div>
        <p className='location' onClick={() => navigate('/citylink')}>
          <span>{city.label}</span>
          <DownOutline fontSize={10} />
        </p>
        <div className='search-input' onClick={() => navigate('/search')}>
          <i><SearchOutline fontSize={16}/></i>
          <span>请输入小区地址</span>
        </div>
      </div>
      <i onClick={() => navigate('/map')}>
        <EnvironmentOutline fontSize={20} color='#fff' fontWeight={700} />
      </i>
    </section>
  )
}

// nav  导航组件
const Nav = () => {

  const navigate = useNavigate()

  const navs = [
    { id: 1, title: '整租', path: '/house', icon: <KoubeiFill fontSize={24} /> },
    { id: 2, title: '合租', path: '/house', icon: <TeamFill fontSize={24} /> },
    { id: 3, title: '找房', path: '/map', icon: <LocationFill fontSize={24} /> },
    { id: 4, title: '出租', path: '/rent', icon: <EditSFill fontSize={24} /> },
  ]
  return (
    <ul className='nav'>
      {
        navs.map(item => (
          <li key={item.id} onClick={() => navigate(item.path)} >
            {item.icon}
            <h3>{item.title}</h3>
          </li>
        ))
      }
    </ul>
  )
}

// rent group 
const Group = () => {

  const [groups, setGroups] = useState([{ id: 1 }])

  useEffect(() => {
    getGroups().then(res => setGroups(res.data.body))
  }, [])
  return (
    <>
      <section className='group-head'>
        <h3>租房小组</h3>
        <a href='/house' className='more'>更多</a>
      </section>
      <Grid columns={2} gap={8} className='group-body'>
        {
          groups.map(item => (
            <Grid.Item key={item.id}>
              <section className='group'>
                <div>
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>
                <img src={`http://microcun.cn:8080${item.imgSrc}`} alt=""></img>
              </section>
            </Grid.Item>
          ))
        }
      </Grid>
    </>
  )
}

// 最新资讯
const Information = () => {
  const [information, setInformation] = useState([])
  useEffect(() => {
    getInformation().then(res => setInformation(res.data.body))

  }, [])
  return (
    <section className='information'>
      <h3>最新资讯</h3>
      <List>
        {
          information.map(info => (
            <List.Item key={info.id} prefix={<Image width={150} height={80} src={`${baseUrl}${info.imgSrc}`}></Image>}
              description={<p>
                <span className="from">{info.from}</span><span className="date">{info.date}</span></p>}>
              {info.title}
            </List.Item>
          ))
        }
      </List>
    </section>
  )
}

// 主页面

export default function Home() {


  return (
    <div className='home'>
      {/* 轮播图 */}
      <Swipers />
      {/* 搜索块 */}
      <Search />
      {/* nav 导航 */}
      <Nav />
      {/* 租房小组 */}
      <Group />

      {/* 最新资讯 */}
      <Information />
    </div>
  )
}