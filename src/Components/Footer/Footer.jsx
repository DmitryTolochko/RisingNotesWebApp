import './Footer.css';
import facebookIcon from '../../Images/Facebook.svg';
import telegramIcon from '../../Images/Telegram.svg';
import youtubeIcon from '../../Images/YouTube.svg';
import phoneIcon from '../../Images/Phone.svg';
import mailIcon from '../../Images/Mail.svg';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Footer(params) {
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);

    if (!window.location.href.includes('login') && !window.location.href.includes('registration') && !window.location.href.includes('messenger'))
    return (
        <div className='footer-wrapper'>
            <div className='stripe'></div>
            <div className='featured'>
                <span className='footer'>
                    <span className='logo_txt'><Link to={cookies.role ? '/' : 'explore'}  className='logo_link'>RISING NOTES</Link></span>
                    <span>
                        <img alt='mail' src={mailIcon}/>
                        <p>dimatol36@gmail.com</p>
                    </span>

                    <span>
                        <a href={!cookies.role ? '/' : '/startpage'} style={{color: 'white'}}>О сервисе</a>
                    </span>
                    
                    {/* <span>
                        <img alt='phone' src={phoneIcon}/>
                        <p>+7 (123) 456-78-09</p>
                    </span> */}
                    {/* <span>
                        <a><img alt='facebook' src={facebookIcon}/></a>
                        <a><img alt='telegram' src={telegramIcon}/></a>
                        <a><img alt='youtube' src={youtubeIcon}/></a>
                    </span> */}
                </span>
            </div>
        </div>
    )
}