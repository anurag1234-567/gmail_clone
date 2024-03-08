import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolTip from './tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';

const Header = ({ toggleSidebar })=>{
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate('');

    const handleSearch = ()=>{ navigate(`/search/${searchInput}`) }

    const handleKeyPress = (event)=>{
        if(event.key === 'Enter') navigate(`/search/${searchInput}`)
    }

    return(
        <div className='header'>
            <div className='logo'>
                <ToolTip text='Main menu' position='left'>
                    <MenuIcon className='icons' onClick={toggleSidebar}/>
                </ToolTip>
                <img src='logo.png' alt='Gmail' />
            </div>

            <div className='searchbar-wrp'>
                <div className='searchbar'>
                    <ToolTip text='Search'>
                        <SearchIcon className='icons' onClick={handleSearch}/>
                    </ToolTip>
                    
                    <input type='text' value={searchInput} onChange={(e)=>{ setSearchInput(e.target.value)} } placeholder='Search mail' onKeyDown={handleKeyPress} />
                    <ClearIcon className={ searchInput ? 'icons clearIcon active' : 'icons clearIcon'} onClick={()=>{ setSearchInput('') }} />

                    <ToolTip text='Show search options'>
                        <TuneIcon className='icons'/>
                    </ToolTip>
                </div>
            </div>

            <div className='header-right'>
                <ToolTip text='Support'>
                    <HelpOutlineIcon className='icons'/>
                </ToolTip>

                <ToolTip text='Settings'>
                    <SettingsIcon className='icons'/>
                </ToolTip>

                <ToolTip text='Google apps' position='right'>
                    <AppsIcon className='icons'/>
                </ToolTip>
            </div>
        </div>
    )
}
export default Header;