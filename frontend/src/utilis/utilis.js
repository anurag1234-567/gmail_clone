import moment from "moment";

export const formatDate = (date)=>{
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