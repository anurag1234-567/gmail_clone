import { useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiPicker from 'emoji-picker-react';
import ErrorPopup from './errorPopup';
import axios from 'axios';

const Compose = (props) =>{
    const closeCompose = props.closeCompose;

    const [email, setEmail] = useState({
        To: props.To || '',
        From: process.env.REACT_APP_FROM,
        Subject: props.Subject || '',
        Body: props.Body || '',
        id: props.id || ''
    })
    
    const [showLargeScreen, setShowLargeScreen] = useState(false);
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [ccEmails, setCcEmails] = useState('');
    const [bccEmails, setBccEmails] = useState('');
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [activeInput, setActiveInput] = useState('Body');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    
    const closeErrorPopup = ()=>{ setShowError(false) }
    const showFullScreen = ()=>{ setShowLargeScreen(true) }
    const hideFullScreen = ()=>{ setShowLargeScreen(false) }
    const handleEmojiPicker = (event)=>{ event.stopPropagation(); setShowEmojiPanel(!showEmojiPanel); }

    const computeLength = ()=>{
        if(showLargeScreen){
            if(showBcc && showCc) return "12";
            else if(showBcc || showCc) return "13";
            else return "14";
        }else{
            if(showBcc && showCc) return "8";
            else if(showBcc || showCc) return "9";
            else return "10";
        }
    }

    const validateEmail = (data)=>{
        const emails = data.split(',').map(email => email.trim());
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(emails.length === 1){
           const validEmail = regex.test(emails[0]);
           return validEmail;
        }else{
            for(let i=0; i < emails.length; i++){
                if(!regex.test(emails[i])) return false; 
            }
            return true;
        }
    }
    
    const handleEmojiClick = (event)=>{
        setEmail({ ...email, [activeInput]: email[activeInput] + event.emoji });
    }

    const handleInputChange = (e)=>{
        setEmail({ ...email, [e.target.name]: e.target.value });
    }

    const sendMail = async()=>{
        if(email.To === ''){
            setError('Please specify at least one recipient.'); setShowError(true);
            return; 
        }

        try{
            let data = {
                Host: process.env.REACT_APP_HOST,
                Username: process.env.REACT_APP_USERNAME,
                Password: process.env.REACT_APP_PASSWORD,
                ...email };

            if(!validateEmail(email.To)){
                setError('Please specify valid email address in To field'); setShowError(true);
                return;
            }

            if(ccEmails.length > 1 && validateEmail(ccEmails)){
                data = { ...data, Cc: ccEmails };
            }else if(ccEmails.length > 1){
                setError('Please specify valid email address in Cc field'); setShowError(true);
                return;
            }

            if(bccEmails.length > 1 && validateEmail(bccEmails)){
                data = { ...data, Bcc: bccEmails };
            }else if(bccEmails.length > 1){
                setError('Please specify valid email address in Bcc field'); setShowError(true);
                return;
            }

            const res = await window.Email.send(data);
            console.log(res);

            await axios.post('http://localhost:8000/email/save', email);
            closeCompose();
        }catch(err){
            console.log(err);
            alert('error');
        }
    }

    const handleClose = async()=>{
        //validate email address before saving emails in drafts
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmail = regex.test(email.To);

        if(!validEmail){ closeCompose(); return; }

        try{
            const res = await axios.post('http://localhost:8000/email/save-draft', email);

            if(props?.draftsEmails){
                let UpdatedDrafts = props.draftsEmails.map(obj =>{
                    if(obj._id === res.data._id) return res.data;
                    return obj;
                })
                props?.updateDraftEmails(UpdatedDrafts);
            }
            closeCompose();
        }catch(err){
            console.log(err);
        }
    }

    return(
      <>
      { showError && <ErrorPopup text={error} closeErrorPopup={closeErrorPopup}/> }

      <div className={ showLargeScreen ? 'compose-wrp large' : 'compose-wrp'} onClick={()=>{ setShowEmojiPanel(false) }} >
        <div className={ showLargeScreen ? 'compose large' : 'compose'}>
            <div className='heading'>
                <span>New Message</span>
                <div>
                    <CloseFullscreenIcon className='icons smallScreen' onClick={hideFullScreen}/>
                    <OpenInFullIcon className='icons largeScreen' onClick={showFullScreen}/>
                    <ClearIcon onClick={handleClose} className='icons'/>
                </div>
            </div>
            <form>
                <div className='to-field-wrp'>
                    <input type='email' name='To' value={email.To} onChange={handleInputChange} placeholder='To' />
                    <span className={ showCc ?  'link hide': 'link'} onClick={()=>{ setShowCc(true) }}>Cc </span>
                    <span className={ showBcc ? 'link hide' : 'link'} onClick={()=>{ setShowBcc(true) }}> Bcc</span>
                </div>

                <input type='email' name='Cc' value={ccEmails} className={showCc ? 'cc active' : 'cc'} onChange={(e)=>{ setCcEmails(e.target.value) }} placeholder='Cc'/>
                <input type='email' name='Bcc' value={bccEmails} className={showBcc ? 'bcc active' : 'bcc'} onChange={(e)=>{ setBccEmails(e.target.value) }} placeholder='Bcc'/>

                <input type='text' name='Subject' value={email.Subject} onChange={handleInputChange} onFocus={()=>{ setActiveInput('Subject') }} placeholder='Subject' />
                <textarea rows={computeLength()} name='Body' value={email.Body} onChange={handleInputChange} onFocus={()=>{ setActiveInput('Body') }} placeholder='Body' />
                <div className='btn-wrp'>
                    <div className='left-content'>
                        <button type='button' onClick={sendMail}>
                            send  <SendIcon className='sendIcon' />
                        </button>
                        <InsertEmoticonIcon className={showEmojiPanel ? 'icons bold' : 'icons' } onClick={handleEmojiPicker}/>
                    </div>
                    <DeleteOutlinedIcon className='icons' onClick={closeCompose} />
                </div>
                <span onClick={(event)=>{ event.stopPropagation() }}>
                { showEmojiPanel && <EmojiPicker emojiStyle='google' searchDisabled='true' suggestedEmojisMode='recent' className='emojiPanel' height="350px" width="380px" onEmojiClick={handleEmojiClick} /> }
                </span>
            </form>
        </div>
      </div>
      </>
    )
}
export default Compose;