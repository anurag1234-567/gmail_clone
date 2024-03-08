const ErrorPopup = ({ text, closeErrorPopup }) => {
    const displayText = text || 'Please specify at least one recipient.'; 

    return(
        <div className='popup-wrp' onClick={closeErrorPopup}>
            <div className='error-popup' onClick={(event)=>{ event.stopPropagation(); }}>
                <h2>Error</h2>
                <p>{displayText}</p>
                <button onClick={closeErrorPopup}>OK</button>
            </div>
        </div>
    )
}
export default ErrorPopup;