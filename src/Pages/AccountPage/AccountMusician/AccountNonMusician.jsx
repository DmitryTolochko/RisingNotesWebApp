import { useCookies } from 'react-cookie';
import { api, axiosAuthorized, axiosRefresh } from '../../../Components/App/App';
import musicIcon from '../../../Images/account-page/music-icon.svg';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

export default function AccountNonMusician(props) {
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);
    const [isHiddenTerms, setIsHiddenTerms] = useState(true);

    async function handleMakeArtist() {
        await axiosAuthorized.post('api/author', {
            userId: cookies.userId,
            name: props.userName,
            about: "",
            vkLink: "",
            webSiteLink: "",
            yaMusicLink: ""
        })
        .catch(err => {throw err});

        await axiosRefresh.post('connect/token', {
            client_id: 'Api',
            client_secret: 'megaclientsecret',
            grant_type: 'refresh_token',
            refresh_token: cookies.refreshToken
        })
        .then(response => {
            setCookies('accessToken', response.data.access_token, { path: '/' });
            setCookies('refreshToken', response.data.refresh_token, { path: '/' });

            let decoded = jwtDecode(response.data.access_token);
            setCookies('authorId', decoded?.authorId, { path: '/' });

            const userId = jwtDecode(response.data.access_token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            setCookies('userId', userId, { path: '/' });
            setCookies('role', decoded.role, { path: '/' });
        })
        .catch(err => {
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'authorId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            window.location.replace('login');
        })

        window.location.reload()
    };

    

    return (
        <div className='account-non-musician'>
            <p>Чтобы получить доступ к профилю музыканта, необходимо получить статус аккаунта <b>Музыкант</b></p>
            <button className="account-page-filled-button" onClick={() => setIsHiddenTerms(false)}>
                <img alt='icon' src={musicIcon}/>
                Стать музыкантом!
            </button>
            {!isHiddenTerms ? (
                            <div className='terms-of-use'>
                            <h2>Пользовательское соглашение</h2>
                            <div>
            <strong>1. Введение</strong><br></br>
            <br></br>
            Настоящее пользовательское соглашение регулирует использование вами сайта Rising Notes, предоставляющего услуги по загрузке и обмену музыкальными и видеофайлами.<br></br>
            <br></br>
            <strong>2. Принятие условий</strong><br></br>
            <br></br>
            Используя Сайт, вы подтверждаете свое согласие с условиями данного Соглашения. Если вы не согласны с условиями, вы не можете использовать Сайт.<br></br>
            <br></br>
            <strong>3. Пользовательские права и обязанности</strong><br></br>
            <br></br>
            3.1. Вы имеете право загружать, публиковать и обмениваться контентом, который вы создали или на который у вас есть все необходимые права.<br></br>
            3.2. Вы соглашаетесь не загружать контент, который нарушает авторские права, товарные знаки или иные права третьих лиц.<br></br>
            3.3. Вы несете ответственность за любой контент, который вы загружаете. Мы не несем ответственности за содержание загруженных вами файлов.<br></br>
            <br></br>
            <strong>4. Права администрации сайта</strong><br></br>
            4.1. Администрация Сайта имеет право удалять любой контент по своему усмотрению, если он нарушает условия данного Соглашения или действующее законодательство.<br></br>
            4.2. Администрация Сайта может в любой момент изменять условия данного Соглашения. Изменения вступают в силу с момента их публикации на Сайте.<br></br>
            <br></br>
            <strong>5. Ограничение ответственности</strong><br></br>
            <br></br>
            5.1. Сайт предоставляется "как есть" и без каких-либо гарантий. Администрация не несет ответственности за любые убытки, возникшие в результате использования или невозможности использования Сайта.<br></br>
            5.2. Мы не гарантируем, что Сайт будет доступен без перерывов или ошибок.<br></br>
            <br></br>
            <strong>6. Конфиденциальность</strong><br></br>
            <br></br>
            6.1. Мы уважаем вашу конфиденциальность и обязуемся защищать ваши личные данные в соответствии с нашей Политикой конфиденциальности.<br></br>
                            </div>
                            <button className="account-page-filled-button" onClick={handleMakeArtist} style={{width: 'fit-content', marginBottom: '0'}}>
                                <img alt='icon' src={musicIcon}/>
                                Согласиться и стать музыкантом!
                            </button>
                        </div>
            ) : (<></>)}

        </div>
    );
}