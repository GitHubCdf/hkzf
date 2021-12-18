import React, { useState, useEffect } from 'react'
import { Toast, Loading } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'

import NavHeader from '../../components/NavHeader'

// 请求接口
import { getCityList } from '../../utils'

import './index.scss'


const listRef = React.createRef()

const CityNavigationList = (props) => {
  const { cityIndex, activeIndex, listRef } = props


  function formatPrefix(prefix) {
    switch (prefix) {
      case 'hot':
        return '热'
      default:
        return prefix.toUpperCase()
    }
  }

  const handleClick = (index) => {
    return function () {
      listRef.current.scrollToRow(index)
    }
  }

  return (
    <ul className='city-navigation-list'>
      {
        cityIndex?.map((prefix, index) => (
          <li key={prefix} onClick={handleClick(index)}>
            <p className={activeIndex === index ? 'active-city' : ''}>{formatPrefix(prefix)}</p>
          </li>
        ))
      }
    </ul>
  )
}

const CityLinkRef = React.forwardRef((props, ref) => {

  // state or data definition
  const [cities, setcities] = useState({ cityList: {}, cityIndex: null })
  const [activeIndex, setactiveIndex] = useState(0)
  const [loading, setloading] = useState(true)

  // 计算返回每一项高度
  function rowHeight({ index }) {
    const { cityList, cityIndex: { [index]: prefix } } = cities
    return cityList[prefix]?.length * 40 + 25 || 0
  }

  // 格式化城市索引
  function formatPrefix(prefix) {
    switch (prefix) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return prefix.toUpperCase()
    }
  }

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    const handleClick = (city) => {
      return function () {
        if (['北京', '杭州', '广州', '上海', '深圳'].includes(city.label)) {
          sessionStorage.setItem('hkzf_location', JSON.stringify(city))
          window.history.go(-1)
        } else {
          Toast.show({
            content: '城市暂无房源信息',
            duration: 1000,
          })
        }
      }
    }
    const { cityList, cityIndex: { [index]: prefix } } = cities
    return (
      <div key={key} style={style}>
        <p className='label'>{formatPrefix(prefix)}</p>
        <ul>
          {
            cityList[prefix]?.map(city => (
              <li key={city.value} className='city-item' onClick={handleClick(city)}>
                {city.label}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  // 用于获取索引
  function onRowRendered({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) {
    if (startIndex !== activeIndex) {
      console.log(startIndex, activeIndex)
      setactiveIndex(startIndex)
    }
  }

  // effect
  useEffect(() => {
    getCityList().then((res) => {
      setcities(res)
      setloading(false)
    })
    console.log(ref)
  }, [ref])

  return (
    <section className="city-list">
      <NavHeader>城市选择</NavHeader>
      {
        loading ? <Loading className="loading" color='primary' /> : (
          <>
            <AutoSizer>
              {
                ({ height, width }) => (<List
                  width={width}
                  height={height}
                  rowCount={cities.cityIndex?.length || 0}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer}
                  onRowsRendered={onRowRendered}
                  scrollToAlignment="start"
                  ref={ref}
                />)
              }
            </AutoSizer>
            <CityNavigationList
              cityIndex={cities.cityIndex}
              activeIndex={activeIndex}
              setactiveIndex={setactiveIndex}
              listRef={ref}
            />
          </>
        )
      }
    </section>
  )
})


export default function CityLink() {
  return (
    <CityLinkRef ref={listRef}></CityLinkRef>
  )
}