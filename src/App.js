// 导入路由
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';

// 导入页面组件
import Main from './pages/Main';
import CityLink from './pages/CityLink';
import Map from './pages/Map'

// 导入地上那方组件或库
import 'react-virtualized/styles.css'


function App() {
  return (
    <Router>
      <div className='App'>
        {/* 配置路由 */}
        <Routes>
          <Route path="/*" element={<Main />}></Route>
          <Route path="/citylink" element={<CityLink />}></Route>
          <Route path="/map" element={<Map/>} ></Route>
        </Routes>
      </div>
    </Router>
  );
}


export default App;
