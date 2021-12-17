import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'

// 请求接口
import { getCityList } from '../../utils'

import './index.scss'


const listRef = React.createRef()

const CityNavigationList = (props) => {
  const { cityIndex, activeIndex, setactiveIndex, scrollToRow } = props


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
      setactiveIndex(index)
      scrollToRow(index)
    }
  }

  return (
    <ul className='city-navigation-list'>
      {
        cityIndex?.map((prefix, index) => (
          <li key={prefix} onClick={handleClick(index)} className={activeIndex === index ? 'active-city' : ''}>
            {formatPrefix(prefix)}
          </li>
        ))
      }
    </ul>
  )
}

const CityLinkRef = React.forwardRef((props, ref) => {
  const navigate = useNavigate()

  // state or data definition
  const [cities, setcities] = useState({ cityList: {}, cityIndex: null })
  const [activeIndex, setactiveIndex] = useState(0)

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
    const { cityList, cityIndex: { [index]: prefix } } = cities
    return (
      <div key={key} style={style}>
        <p className='label'>{formatPrefix(prefix)}</p>
        <ul>
          {
            cityList[prefix]?.map(city => (
              <li key={city.value} className='city-item'>
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
      setactiveIndex(startIndex)
    }
  }

  // effect
  useEffect(() => {
    getCityList().then((res) => {
      setcities(res)
      ref.current?.measureAllRows()
    })
  }, [ref])

  return (
    <section className="city-list">
      <NavBar style={{ '--border-bottom': '1px solid #eee' }} onBack={() => navigate(-1)}>城市选择</NavBar>
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
        scrollToRow={ref.current?.scrollToRow.bind(listRef.current)}
      />
    </section>
  )
})


export default function CityLink() {
  return (
    <CityLinkRef ref={listRef}></CityLinkRef>
  )
}