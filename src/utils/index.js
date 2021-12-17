import { getCity } from '../request/home'
import { getCities, getHotCity } from '../request/citylink'

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    let location = sessionStorage.getItem('hkzf_location')
    if (!location) {
      window.AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new window.AMap.CitySearch()
        citySearch.getLocalCity(async function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            try {
              location = await getCity(result.city)
              sessionStorage.setItem('hkzf_location', JSON.stringify(location.data.body))
              resolve(location.data.body)
            } catch (e) {
              reject(e)
            }
          }
        })
      })
    }
    resolve(JSON.parse(location))
  })
}

export async function getCityList() {
  const [currentCity, { data: { body: hotCities } }, { data: { body: cities } }] = await Promise.all([getCurrentLocation(), getHotCity(), getCities()])
  //
  const cityList = {}
  cities.forEach(city => {
    const prefix = city.short.substr(0, 1)
    if (cityList[prefix]) {
      cityList[prefix].push(city)
    } else {
      cityList[prefix] = [city]
    }
  })
  const cityIndex = Object.keys(cityList).sort()

  return Promise.resolve({ cityList: { '#': [currentCity], hot: hotCities, ...cityList }, cityIndex: ['#', 'hot', ...cityIndex] })
}