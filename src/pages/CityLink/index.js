import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'

// 请求接口
import { getCityList } from '../../request/citylink'

function CityLink() {
  const navigate = useNavigate()
  useEffect(() => {
    getCityList().then(res => console.log(res))
  }, [])
  return (
    <>
      <NavBar style={{'--border-bottom': '1px solid #eee'}} onBack={() => navigate(-1)}>城市选择</NavBar>
    </>
  )
}


export default CityLink