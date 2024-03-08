const ReactToast = ({ text })=>{
    
    const displayText = text || 'Loading...';
    return(
        <>
        <div className="toast-wrp">{displayText}</div>
        </>
    )
}
export default ReactToast;