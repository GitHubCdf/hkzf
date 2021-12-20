import React, { useEffect, useState } from 'react'
import { Image, List, Toast } from 'antd-mobile'
// import { Loading  } from 'antd-mobile-icons'
// 自定义组件
import NavHeader from '../../components/NavHeader'
// request
import { getAreaHouseInfo, getCommunityHouseInfo } from '../../request/map'
import style from './index.module.scss'


// 获取地图函数
const { AMap } = window

const HouseInfo = ({ label, value, show }) => {
  // state 
  const [houseInfo, setHouseInfo] = useState([])
  // 获取房源信息
  async function getHouseInfo(value) {
    if(value === '') return; 
    const { data: { body: { list } } } = await getCommunityHouseInfo(value)
    setHouseInfo(list)
  }

  // Did Mount
  useEffect(() => {
    getHouseInfo(value)
  }, [value])

  return (
    <div className={[style.house, show ? style.houseShow : ''].join(' ')}>
      <section className={style.community}>
        <h3>{label}</h3>
      </section>
      <section className={style.houseInfo}>
        <List>
          {
            houseInfo.map(({ houseCode, houseImg, title, desc, tags, price }) => (
              <List.Item
                key={houseCode}
                prefix={
                  <Image src={`http://microcun.cn:8080${houseImg}`} height={80} width={120} fit='cover' />
                }
              >
                <div className={style.houseDesc}>
                  <h4>{title}</h4>
                  <div>
                    <p className={style.desc}>{desc}</p>
                    <p>
                      {
                        tags.map(tag => (
                          <span className={style.tag} key={tag}>{tag}</span>
                        ))
                      }
                    </p>
                    <span className={style.housePrice}>{price}元/月</span>
                  </div>
                </div>
              </List.Item>
            ))
          }
        </List>
      </section>
    </div>
  )

}


export default function Map() {
  // state 
  const [houseShow, sethouseShow] = useState(false)
  const [communityInfo, setcommunityInfo] = useState({ label: '', value: '' })
  // 创建 marker

  // initMap 初始化地图
  function initMap() {
    // 
    Toast.show({
      icon: 'loading',
      content: '加载中…',
      duration: 0,
    })
    // 初始化地图
    const map = new AMap.Map('container', {
      zoom: 10,
      zooms: [4, 18]
    })
    // 添加插件
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {//异步同时加载多个插件
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
      var scale = new AMap.Scale();//驾车路线规划
      map.addControl(scale);
    })

    map.on('touchmove', () => {
      sethouseShow(false)
    })

    return map
  }

  // 绘制相关信息
  function paintMapInfo(map) {
    // 创建 rectangle marker
    function createRect({ label, count, coord: { longitude: lng, latitude: lat }, value }) {
      // 创建文本标记
      const marker = new AMap.Text({
        anchor: 'center',
        text: `<div class=${style.mapRect}>
                <p>${label}</p>
                <span>${count}套</span>
              </div>`
      })
      marker.setStyle({
        border: 0,
        padding: 0,
        backgroundColor: 'transparent',
        color: '#fff',
        textAlign: 'center',
      })
      marker.setPosition(new AMap.LngLat(lng, lat))
      marker.on('touchstart', () => {
        const position = new AMap.LngLat(lng, lat)
        map.setCenter(position)
        setcommunityInfo({ label, value })
        sethouseShow(true)
      })
      return marker
    }
    // 创建circle标记 marker
    function createCircle({ label, count, coord: { longitude: lng, latitude: lat }, value }) {
      // 创建文本标记
      const marker = new AMap.Text({
        anchor: 'center',
        text: `<div class=${style.mapCircle}>
                <p>${label}</p>
                <span>${count}套</span>
              </div>`
      })
      marker.setStyle({
        border: 0,
        padding: 0,
        backgroundColor: 'transparent',
        width: '60px',
        height: '60px',
        color: '#fff',
        textAlign: 'center',
      })
      marker.setPosition(new AMap.LngLat(lng, lat))
      marker.on('touchstart', () => {
        Toast.show({
          icon: 'loading',
          content: '加载中',
          duration: 0,
        })
        create({ lng, lat, value })
      })
      return marker
    }

    // 
    function create({ lng, lat, value }) {
      const { nextZoom: zoom, type } = getMarkerType(map)
      const creatMarker = type === 'circle' ? createCircle : createRect
      map.clearMap()
      map.setZoomAndCenter(zoom, new AMap.LngLat(lng, lat))
      getAreaHouseInfo(value).then(({ data: { body } }) => {
        map.add(body.map(creatMarker))
        Toast.clear()
      })
    }

    // 根据 zoom 判断 marker 类型
    function getMarkerType(map) {
      const zoom = map.getZoom()
      if (zoom < 12) {
        return { type: 'circle', nextZoom: 12 }
      } else {
        return { type: 'rect', nextZoom: 15 }
      }
    }

    // 获取当前城市地址
    const { label, value } = JSON.parse(sessionStorage.getItem('hkzf_location'))
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: label
      })
      geocoder.getLocation(label, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // result中对应详细地理坐标信息
          const { geocodes: { '0': { location: { lng, lat } } } } = result
          map.setZoomAndCenter(10, new AMap.LngLat(lng, lat))
          getAreaHouseInfo(value).then(({ data: { body } }) => {
            Toast.clear()
            map.add(body.map(createCircle))
          })
        }
      })
    })
  }



  // DidMount
  useEffect(() => {
    const map = initMap()
    paintMapInfo(map)
    return () => {
      console.log('clear and destoryed')
      map.destroy()
    }
  }, [])

  // 

  return (
    <>
      <NavHeader>地图找房</NavHeader>
      <div id="container" className={style.container}></div>
      <HouseInfo label={communityInfo.label} value={communityInfo.value} show={houseShow}></HouseInfo>
    </>
  )
}



// export default class Map extends React.Component {

//   state = {}

//   componentDidMount() {
//     // 创建地图
//     let map = new AMap.Map('container')
//     // 添加插件
//     AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {//异步同时加载多个插件
//       var toolbar = new AMap.ToolBar();
//       map.addControl(toolbar);
//       var scale = new AMap.Scale();//驾车路线规划
//       map.addControl(scale);
//     })

//     // 创建 marker
//     function creatMarker({ label, count, coord: { longitude: lng, latitude: lat }, value }) {
//       // 创建文本标记
//       const marker = new AMap.Text({
//         anchor: 'center',
//         text: `<div class=${style.mapMarker}>
//               <p>${label}</p>
//               <span>${count}套</span>
//             </div>`
//       })
//       marker.setStyle({
//         border: 0,
//         padding: 0,
//         backgroundColor: 'transparent',
//         width: '60px',
//         height: '60px',
//         color: '#fff',
//         textAlign: 'center',
//       })
//       marker.setPosition(new AMap.LngLat(lng, lat))
//       marker.on('touchstart', () => {
//         map.clearMap()
//         map.setZoomAndCenter(11, new AMap.LngLat(lng, lat))
//         getAreaHouseInfo(value).then(({ data: { body } }) => {
//           map.add(body.map(creatMarker))
//         })
//       })
//       return marker
//     }

//     const { label, value } = JSON.parse(sessionStorage.getItem('hkzf_location'))
//     //

//     // 获取当前城市地址
//     AMap.plugin('AMap.Geocoder', function () {
//       var geocoder = new AMap.Geocoder({
//         // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
//         city: label
//       })
//       geocoder.getLocation(label, function (status, result) {
//         if (status === 'complete' && result.info === 'OK') {
//           // result中对应详细地理坐标信息
//           const { geocodes: { '0': { location: { lng, lat } } } } = result
//           map.setZoomAndCenter(10, new AMap.LngLat(lng, lat))
//         }
//       })
//     })
//     // 获取房源数据
//     getAreaHouseInfo(value).then(({ data: { body } }) => {
//       map.add(body.map(creatMarker))
//     })
//   }



//   render() {
//     return (
//       <>
//         <NavHeader>地图找房</NavHeader>
//         <div id="container" className={style.container}></div>
//       </>
//     )
//   }
// }