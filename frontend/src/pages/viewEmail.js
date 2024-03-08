import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToolTip from "../components/tooltip";
import moment from "moment";
import axios from "axios";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function ViewEmail(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const res = await axios.get(`http://localhost:8000/email/${id}`);
                setEmail(res.data);

                if(!res.data.MarkRead) {
                    const res = await axios.get(`http://localhost:8000/email/toggleReadStatus/${id}`);
                    console.log(res.data);
                }
            }catch(err){
                console.log(err); }
        }
        fetchData();
    }, [id]);

    const handleDelete = async(id)=>{
        try{
            await axios.get(`http://localhost:8000/delete/${id}`);
            navigate(-1);
        }catch(err){
          console.log(err); }
      }

    const handleStarred = async(id)=>{
    try{
      const res = await axios.get(`http://localhost:8000/email/starred/${id}`);
      console.log(res.data);
      setEmail({ ...email, Starred: !email.Starred });
    }catch(err){
      console.log(err); }
    }  

    const formatDate = ( timestamp )=>{
        const date = new moment(timestamp);
        const formatedDate = date.format('DD MMM YYYY, HH:mm');
        return formatedDate;
    }

    return(
        <>
        {
        email && 
        <div className="viewEmail">
            <div className="header">
                <ToolTip text='Back'>
                    <span onClick={()=>{ navigate(-1) }} className="icons"><ArrowBackIcon /></span>
                </ToolTip>

                <ToolTip text='Delete'>
                    <span className="icons" onClick={()=>{ handleDelete(email._id) }}><DeleteOutlineIcon /></span>
                </ToolTip>
            </div>

            <div className='content-wrp'>
                <p className="subject">{email.Subject}</p>
                <div className="wrp">
                    <p className="profile">{email.From.charAt(0).toUpperCase()}</p>
                    <div className="content-wrp">
                        <div className="email-heading">
                            <div className="row1">
                                <div style={{ fontWeight: 600, letterSpacing: '.4px' }}>{email.From}</div>
                                <div>
                                    <span style={{ color: "rgba(128, 128, 128, 0.88)" }}>{formatDate(email.createdAt)}</span>

                                    <ToolTip text={email.Starred ? 'Starred' : 'Not starred'}>
                                        <span className="icons" onClick={()=>{ handleStarred(email._id) }}>{ email.Starred ?  <StarIcon style={{ color: "#F4B400" }}/>  : <StarBorderIcon />}</span>
                                    </ToolTip>
                                </div>
                            </div>
                            <div className="row2">
                                {  (email.Type === 'inbox') ? 'to me' : email.To }
                            </div>
                        </div>
                        <div className="body">{email.Body}</div>
                    </div>
                </div>
            </div>

        </div>
        }
        </>
    )
}
export default ViewEmail;