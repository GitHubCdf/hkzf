import axios from 'axios'

export async function getCities(level=1) {
  return await axios.get(`http://microcun.cn:8080/area/city?level=${level}`)
}

export async function getHotCity() {
  return await axios.get(`http://microcun.cn:8080/area/hot`)
}