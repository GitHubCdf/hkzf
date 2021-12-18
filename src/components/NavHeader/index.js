import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'


export default function NavHeader({children,onBack}) {
  const navigate = useNavigate()

  // 默认返回操作
  const defaultBack = () => {
    navigate(-1)
  }

  return (
    <NavBar
      style={{
        '--border-bottom': '1px #eee solid',
      }}
      onBack={onBack || defaultBack}
    >
      {children}
    </NavBar>
  )
}