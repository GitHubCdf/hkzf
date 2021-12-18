import { useEffect, useState } from 'react'

// 自定义组件
import NavHeader from '../../components/NavHeader'
import { getAreaHouseInfo } from '../../request/map'
import style from './index.module.scss'


// 获取地图函数
const { AMap } = window

export default function Map() {
  const [coords, setcoords] = useState({ lng: 116.397428, lat: 39.90923 })
  const [areaHouse, setareaHouse] = useState([])

  function creatMarker({label,count,coord:{longitude,latitude}}) {
    // 创建文本标记
    const marker = new AMap.Text({
      anchor: 'center',
      text: `<div class=${style.mapMarker}>
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
    marker.setPosition(new AMap.LngLat(longitude,latitude))
    marker.on('touchstart', (e) => {
      console.log(e)
    })
    return marker
  }

  // 获取城市坐标
  useEffect(() => {
    const { label, value } = JSON.parse(sessionStorage.getItem('hkzf_location'))
    // AMap.plugin('AMap.CitySearch', function () {
    //   var citySearch = new AMap.CitySearch()
    //   citySearch.getLocalCity(function (status, result) {
    //     if (status === 'complete' && result.info === 'OK') {
    //       // 查询成功，result即为当前所在城市信息
    //       const { bounds } = result
    //       const { lat, lng } = bounds.getCenter()
    //       console.log({ lat, lng })
    //       setcoords({ lat, lng })
    //     }
    //   })
    // })
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: label
      })

      geocoder.getLocation(label, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // result中对应详细地理坐标信息
          const { geocodes: { '0': { location: { lng, lat } } } } = result
          setcoords({ lat, lng })
        }
      })
    })
    //
    getAreaHouseInfo(value).then(({ data: { body } }) => {
      setareaHouse(body)
    })
  }, [])

  // 创建地图
  useEffect(() => {
    // 初始化地图
    const { lng, lat } = coords
    const map = new AMap.Map('container')
    const location = new AMap.LngLat(lng, lat)
    map.setZoomAndCenter(10, location)
    // 添加插件
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {//异步同时加载多个插件
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
      var scale = new AMap.Scale();//驾车路线规划
      map.addControl(scale);
    })

    areaHouse.map(creatMarker).forEach(marker => marker.setMap(map))



    // 
    return () => {
      map.destroy()
    }
  }, [coords, areaHouse])

  return (
    <>
      <NavHeader>地图找房</NavHeader>
      <div id="container" className={style.container}></div>

    </>
  )
}