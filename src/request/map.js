import axios from 'axios'

export function getAreaHouseInfo(id) {
  return axios.get(`http://microcun.cn:8080/area/map?id=${id}`)
}

export function getCommunityHouseInfo(id) {
  return axios.get(`http://microcun.cn:8080/houses?cityId=${id}`)
}