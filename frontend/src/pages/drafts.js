import { useState, useEffect } from 'react';
import Compose from '../components/compose';
import ReactToast from '../components/reactToast';
import ToolTip from '../components/tooltip';
import moment from 'moment';
import axios from 'axios';

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

const Drafts = () =>{
  const [data, setData] = useState(null);
  const [ids, setIds]  = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [refresh, setRefresh] = useState(0);
  const [composeState, setComposeState] = useState({ To: '', Subject: '', Body: '', _id : ''});
  const [showCompose, setShowCompose] = useState(false);
  const closeCompose = ()=>{ setShowCompose(false); }
  
  

  useEffect(()=>{
    setIsLoading(true);
    const fetchdata = async()=>{
      try{
        const res = await axios.get(`http://localhost:8000/emails/draft/${pageNumber}`);
        const { emails, totalPages } = res.data;
        setData(emails);
        setTotalPages(totalPages);
      }catch(err){
        console.log(err); }
    }
    fetchdata();
    setIsLoading(false);
  }, [refresh, pageNumber]);

  const handleNext = ()=>{ 
    if(pageNumber !== totalPages) setPageNumber(pageNumber => pageNumber + 1);
  }

  const handlePrev = ()=>{
    if(pageNumber > 1) setPageNumber(pageNumber => pageNumber - 1);
  }

  const toggleSelectAll = (event)=>{
    if(event.target.checked){
      const allIds = data.map(email => email._id);
      setIds(allIds); setSelectAll(true);
    }else{
      setIds([]); setSelectAll(false); }
  }

  const handleCheckboxClick = (event)=>{
    const id = event.target.value;

    if(event.target.checked){
      setIds([...ids, id]);
      if(!selectAll) setSelectAll(true);
    }else{
      const filterIds = ids.filter(item => item !== id);
      setIds(filterIds);
      if(filterIds.length < 1) setSelectAll(false);
    }
  }

  const handleStarred = async(event, id)=>{
    try{
      event.stopPropagation();
      const res = await axios.get(`http://localhost:8000/email/starred/${id}`);
      console.log(res.data);

      const filteredData = data.map(email => {
        if(email._id === id) return { ...email, Starred: !email.Starred };
        return email;
      })

      setData(filteredData);
    }catch(err){
      console.log(err); }
  }

  const handleRead = async(event, id)=>{
    try{
      event.stopPropagation();
      const res = await axios.get(`http://localhost:8000/email/toggleReadStatus/${id}`);
      console.log(res.data);

      const filteredData = data.map(email => {
        if(email._id === id) return { ...email, MarkRead: !email.MarkRead };
        return email;
      })

      setData(filteredData);
    }catch(err){
      console.log(err); }
  }

  const handleDelete = async(event, id)=>{
    try{
      event.stopPropagation();
      const res = await axios.get(`http://localhost:8000/delete/${id}`);
      console.log(res.data);

      const filteredData = data.filter(email => email._id !== id);
      setData(filteredData);
    }catch(err){
      console.log(err); }
  }

  const handleDeleteMany = async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/delete-Many/emails`, {ids});
      console.log(res.data);

      setRefresh(refresh + 1);
      setSelectAll(false); setIds([]);
    }catch(err){
      console.log(err); }
  }

  const formatDate = (date)=>{
    const currentDate = new moment();
    const dateFromTimestamp = new moment(date);

    const isToday = currentDate.isSame(dateFromTimestamp, 'day');
    let formattedDate;

    if(isToday){
      formattedDate = dateFromTimestamp.format('HH:mm');
    }else{
      formattedDate = dateFromTimestamp.format('DD MMM');
    }
    return formattedDate;
  }

  const handleDraftClick = (email)=>{
    setComposeState(email);
    setShowCompose(true);
  }

  return(
    <>
    { isLoading && <ReactToast />}
    { !isLoading && 
      <>
      <div className='header'>
            <div className='wrp'>
              <ToolTip text='Select'>
                <input type='checkbox' checked={selectAll} onChange={toggleSelectAll}/>
              </ToolTip>

              <ToolTip text='Refresh'>
                <RefreshOutlinedIcon className='icons' onClick={()=>{ setRefresh(refresh + 1) }}/>
              </ToolTip>

              <ToolTip text='Delete'>
                <DeleteOutlineIcon className='icons' onClick={handleDeleteMany} />
              </ToolTip>
            </div>

          { totalPages > 1 && 
            <div className='pagination'> 
              Page {pageNumber} of {totalPages} 
              <span className='arrow' onClick={handlePrev}>&lt;</span> 
              <span className='arrow' onClick={handleNext}>&gt;</span> 
            </div>
          }
        </div>

      {
        data && data.length === 0 ? <p className='empty-message'>You don't have any saved drafts. Saving a draft allows you to keep a message that you are not ready to sent yet.</p>
        : (
          <div className='content-wrp'>
          {
            data && data.map((email, index)=>{
              return  <div key={index} className='email-list' onClick={()=>{ handleDraftClick(email) }}>
                        <div className='icons-wrp-left'>

                        <ToolTip text='Select'>
                              <span className='checkbox' onClick={(event)=>{ event.stopPropagation() }}>
                                <input type='checkbox' value={email._id} checked={ids.includes(email._id)} className='checkbox' onChange={handleCheckboxClick}/>
                              </span>
                            </ToolTip>

                            <ToolTip text={email.Starred ? 'Starred' : 'Not starrred'}>
                              <span className='icons' onClick={(event)=>{ handleStarred(event, email._id) }}>
                                { email.Starred ? <StarIcon style={{ color: "#F4B400" }}/> : <StarBorderIcon /> }
                              </span>
                            </ToolTip>

                        <p className='draft'>Draft</p>
                        </div>
                        <p className='body'>
                          <span className={ email.MarkRead ? 'subject' : 'subject bold'}>{email.Subject ? email.Subject : "(no subject)"}</span> - {email.Body}
                        </p>
                        <p className='time'>{formatDate(email.updatedAt)}</p>

                        <div className='icons-wrp-right'>
                          <ToolTip text={ email.MarkRead ? 'Mark as unread' : 'Mark as read' }>
                              <span className='icons' onClick={(event)=>{ handleRead(event, email._id) }}>
                                { email.MarkRead ? <MarkEmailUnreadOutlinedIcon /> : <DraftsOutlinedIcon /> }
                              </span>
                            </ToolTip>

                            <ToolTip text='Delete'>
                              <DeleteOutlineIcon className='icons' onClick={(event)=>{ handleDelete(event, email._id) }}/>
                            </ToolTip>
                        </div>
                      </div>
            })
          }
          </div>
        )
      }

      { showCompose && 
        <Compose closeCompose={closeCompose} To={composeState.To} Subject={composeState.Subject} Body={composeState.Body} id={composeState._id} updateDraftEmails={setData} draftsEmails={data}/>
      }
      </>
    }

    </>
  )
}
export default Drafts;