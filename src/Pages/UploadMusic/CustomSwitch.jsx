import React from 'react';

function CustomSwitch({flag=false, setFlag}){
    const handleswitchStateClick = () => {
        const targetDiv = document.getElementById("myDiv");
        if (!flag & targetDiv.style.display !== "grid") {
            targetDiv.style.display = "grid";
        } else {
            targetDiv.style.display = "none";
        }
        setFlag(!flag);
    }

    return (
        <div className='song-availability-text'>
            <h2 className='column1-h2'>Текст</h2>
            <div onClick={handleswitchStateClick} className={!flag ? 'text-switch' : 'text-switch-toggled'}>
                <div className="switch-ball"></div>
            </div>
        </div>
    )
}

export default CustomSwitch;