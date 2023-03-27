import React from 'react'
import Status_3 from '../images/readed-icon.png'

export const OneMessage = ({text, time, isMy, key, id, status}) => {
    const Status_0 = 'https://img.icons8.com/carbon-copy/100/000000/clock--v1.png'
    const Status_1 = 'https://img.icons8.com/ios/50/000000/checkmark--v1.png'
    const Status_2 = 'https://img.icons8.com/ios-filled/50/000000/double-tick.png'

    const messageStyle = {
        maxWidth: '60%',
        borderRadius: '8px',
        backgroundColor: isMy ? '#2284FF' : '#F1F0F0',
        color: isMy ? 'white' : 'black'
    }

    if (isMy === false){
        status = -1
    }

    return (
        <div className='d-flex flex-column w-100 p-1' style={{alignItems: isMy ? 'flex-end' : 'flex-start'}} key={key} id={id}>
            <div className='p-2' style={messageStyle}>
                <div>
                    {text}
                </div>
            </div>
            <div className='d-flex'>
                <div style={{color: 'grey', fontSize: '12px', marginRight: '10px'}}>
                    {time}
                </div>
                {status === 0 ? (
                    <img src={Status_0} alt='status' style={{width: '15px', height: '15px'}}/>
                ) : status === 1 ? (
                    <img src={Status_1} alt='status' style={{width: '15px', height: '15px', transform: 'rotate(5deg)'}}/>
                ) : status === 2 ? (
                    <img src={Status_2} alt='status' style={{width: '15px', height: '15px'}}/>
                ) : status === 3 ? (
                    <img src={Status_3} alt='status' style={{width: '15px', height: '15px'}}/>
                ) : (
                    <div />
                )}
            </div>
        </div>
    )
}
