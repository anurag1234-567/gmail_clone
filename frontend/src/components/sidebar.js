import { useState } from 'react';
import { Link } from 'react-router-dom';
import Compose from '../components/compose';

//icons import
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InboxIcon from '@mui/icons-material/Inbox';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SendIcon from '@mui/icons-material/Send';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
 
const Sidebar = ({ hideSidebar }) => {
    const [showCompose, setShowCompose] = useState(false);
    const [activeLink, setActiveLink] = useState('/inbox');
    const closeCompose = ()=>{ setShowCompose(false); }

    const handleLinkClick = (link)=>{ setActiveLink(link) }

    return(
        <>
        <div className={ hideSidebar ? 'sidebar hide' : 'sidebar' }>
            <div className='compose-btn' onClick={()=>{ setShowCompose(true) }}>
                <CreateOutlinedIcon />
                <span className='text'>Compose</span>
            </div>

            <Link to='/' className={activeLink === '/inbox' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/inbox') }}>
                <InboxIcon />
                <span className='text'>Inbox</span>
            </Link>

            <Link to='/starred' className={activeLink === '/starred' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/starred') }}>
                <StarOutlineIcon />
                <span className='text'>Starred</span>
            </Link>

            <Link to='/sent' className={activeLink === '/sent' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/sent') }}>
                <SendIcon />
                <span className='text'>Sent</span>
            </Link>

            <Link to='/drafts' className={activeLink === '/drafts' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/drafts') }}>
                <InsertDriveFileOutlinedIcon />
                <span className='text'>Drafts</span>
            </Link>

            <Link to='/allmail' className={activeLink === '/allmail' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/allmail') }}>
                <MailOutlinedIcon />
                <span className='text'>All Mail</span>
            </Link>

            <Link to='/bin' className={activeLink === '/bin' ? 'links active' : 'links'} onClick={()=>{ handleLinkClick('/bin') }}>
                <DeleteOutlinedIcon />
                <span className='text'>Bin</span>
            </Link>

        </div>
        { showCompose && <Compose closeCompose={closeCompose}/> }
        </>
    )
}
export default Sidebar;