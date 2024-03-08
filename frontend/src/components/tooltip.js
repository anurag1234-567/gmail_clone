function ToolTip({ text, children, position }){
    return (
        <div className='tooltop-container'>
            <div className='children'>{ children }</div>
            <div className={position ? `tooltip ${position}` : 'tooltip'}>{text}</div>
        </div>
    )
}
export default ToolTip;