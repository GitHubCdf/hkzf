import { useEffect } from 'react'
import './index.scss'
export default function Map() {
  useEffect(() => {
    const map = new window.AMap.Map('container', {
      zoom: 11,
      center: [116.397428, 39.90923],
    });
    return map.destory
  }, [])
  return (
    <div id="container"></div>
  )
}