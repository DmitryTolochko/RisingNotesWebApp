import './ErrorMessage.css';
import errorImg from '../../Images/error.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { hideError } from '../../Redux/slices/errorMessageSlice';

export default function ErrorMessage() {
    const dispatch = useDispatch()
    const { errorText, errorVisibility } = useSelector(state => state.errorMessage)

    useEffect(() => {
        // логика очистки ошибки
        if (errorVisibility) {
            const timer = setTimeout(() => {
                dispatch(hideError());
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errorVisibility])

    return(<div className={errorVisibility ? `error-message` : `error-message error-hidden`}>
        <span>
            <img src={errorImg} alt='error'/>
            <p>Произошла ошибка</p>
        </span>
        <p>{errorText}</p>
    </div>);
}