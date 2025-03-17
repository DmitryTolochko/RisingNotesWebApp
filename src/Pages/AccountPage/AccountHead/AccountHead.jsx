import defaultAvatar from '../../../Images/main-placeholder.png';
import statsIcon from '../../../Images/account-page/stats-icon.svg';
import subsIcon from '../../../Images/account-page/subs-icon.svg';
import creditIcon from '../../../Images/account-page/credit-card-red-icon.svg';
import bigEdit from '../../../Images/account-page/edit-big.svg';
import { useEffect, useRef, useState } from 'react';

import { useCookies } from 'react-cookie';
import {  api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../../../Components/App/App';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showError } from '../../../Redux/slices/errorMessageSlice';
import { shortenText } from '../../../Tools/Tools';

export default function AccountHead (props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const imgRef = useRef(null);
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [subsCount, setSubsCount] = useState(0);
    const [auditionsCount, setAuditions] = useState(0);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'subscriptions', 'userId']);
    
    const resize = useSelector((state)=> state.resize.value)

    useEffect(() => {
        // получение аватарки и количества прослушиваний музыканта, количество подписчиков
        axiosPictures.get(api + `api/user/${cookies.userId}/logo/link`)
        .then(response => {setAvatar(response?.data?.presignedLink)})
        .catch(err => {setAvatar(defaultAvatar)});
         
        if (props.role === 'author' && props.authorId !== undefined) {
            axiosUnauthorized.get(api + `api/subscription/${props.authorId}/count`)
            .then(response => {
                setSubsCount(response.data.count);
            });
            axiosAuthorized.get(`api/author/${props.authorId}/audition/count`)
            .then(response => {
                setAuditions(response.data.auditionCount);
            });
        }
    }, []);

    const handleFileInput = () => {
        fileRef.current.click();
    }

    const changeLogo = (event) => {
        // изменение аватарки
        event.preventDefault();
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size <= 5*1024*1024) {
                const formData = new FormData();
                formData.append('File', file);
                formData.append('type', 'image/jpeg');

                axiosAuthorized.patch(`api/user/logo`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                .then(response => {
                    window.location.reload();
                });
            }
            else {
                dispatch(showError({errorText: 'Изображение должно быть не больше 5 Мб'}))
            }
        }
    }

    return (
        <div className="account-page-head">
            <button className="account-page-avatar-button" onClick={handleFileInput}>
                <div className='account-page-avatar-change'><img draggable='false' src={bigEdit}/></div>
                <img alt='avatar' ref={imgRef} src={avatar}/>
            </button>
            <span>
                <h1 className="account-page-username">{shortenText(props.userName, 20)}</h1>
                <p className='account-page-user-status'>{props.role === 'author' ? 'Музыкант' : 'Слушатель'}</p>
                {props.role === 'author' ? (
                    <span className='account-stats'>
                        <p className='account-page-stats'><img src={statsIcon}/>{resize === 'standart' ? 'Прослушиваний в месяц: ' + auditionsCount : auditionsCount}</p>
                        <p className='account-page-stats'><img src={subsIcon}/>{resize === 'standart' ? 'Подписчиков: ' + subsCount : subsCount}</p>
                        {/* <p className='account-page-stats'><img src={creditIcon}/>{resize === 'standart' ? 'Месяц оплачен' : 'Оплачено'}</p> */}
                    </span>
                ) : <></>}
            </span>

            <input type='file' accept=".jpg,.png" className='input-file' ref={fileRef} onChange={changeLogo} maxsize='5000000'></input>
        </div>
    );
}