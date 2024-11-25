import React from 'react';
import Chevron from '../Images/controller/chevron-left.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';

function BackButton({onClick=undefined}) {
    const navigate = useNavigate();
    const resize = useSelector((state)=> state.resize.value);

    function handleClick() {
        if (onClick !== undefined) onClick();
        else navigate(-1);
    }

    if (resize === 'standart')
    return (
        <button className='back-button' onClick={handleClick}>
            <img className='back-chervon' alt='back' src={Chevron}/>Назад
        </button>
    )
}

export default BackButton