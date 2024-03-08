import { useState } from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Main from './main';
import './App.css';

function App(){
 
  const [hideSidebar, setHideSidebar] = useState(false);
  const toggleSidebar = ()=>{ setHideSidebar(!hideSidebar) }

  return(
    <>
      <Header toggleSidebar={toggleSidebar}/>
      <div className='main-wrp'>
        <Sidebar hideSidebar={hideSidebar}/>
        <Main />
      </div>
    </>
  )
}
export default App;