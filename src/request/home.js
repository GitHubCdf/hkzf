import axios from 'axios';

export async function getSwiperItems() {
  return await axios.get('http://microcun.cn:8080/home/swiper')
}


export async function getGroups(area="AREA|88cff55c-aaa4-e2e0") {
  return await axios.get(`http://microcun.cn:8080/home/groups?area=${area}`)
}

export async function getInformation(area="AREA|88cff55c-aaa4-e2e0") {
  return await axios.get(`http://microcun.cn:8080/home/news?area=${area}`)
}

export async function getCity(cityName="上海") {
  return await axios.get(`http://microcun.cn:8080/area/info?name=${cityName}`)
}