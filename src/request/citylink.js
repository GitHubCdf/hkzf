import axios from 'axios'

export async function getCityList(level=1) {
  return await axios.get(`http://microcun.cn:8080/area/city?level=${level}`)
}