import './StartPage.css';
import bgImage from '../../Images/start-page/start-page-bg.svg';
import bgImageSecond from '../../Images/start-page/start-page-bg-2.png';
import CustomButton from '../../Components/CustomButton/CustomButton';
import microImage from '../../Images/start-page/start-page-micro.png';
import phonesImage from '../../Images/start-page/start-page-phones.png';
import messageIcon from '../../Images/start-page/message.png';
import musicIcon from '../../Images/start-page/music.svg';
import usersIcon from '../../Images/start-page/users.svg';
import stripe from '../../Images/login/bottom-design-element.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function StartPage() {
    const navigate = useNavigate();
    const resize = useSelector((state)=> state.resize.value);

    return (
        <>
        <div className='comment-page-wrapper start-page-wrapper'>
            <div className='start-page-first-block'>
                <h1 className='start-page-h'>Новые имена и новый звук на <h1 className='start-page-h colored'>Rising Notes</h1></h1>
                <p className='start-page-p'>Сервис для музыкального нетворкинга с функциями стриминга</p>
                <div className='start-page-buttons'>
                    <CustomButton text={'Искать музыкантов'} func={() => navigate('/explore')}/>
                    <button className='account-page-unfilled-button' onClick={() => navigate('/login')}>
                        Вход
                    </button>
                </div>
                
            </div>

            <img alt={'background'} src={bgImage} className='start-page-bg'/>
        </div>
        

        <div className='comment-page-wrapper' style={{paddingTop: '128px'}}>

            <div className='start-page-features'>
                <h2  className='start-page-h2'>Что такое Rising Notes?</h2>
                <div className='start-page-feature'>
                    <div className='start-page-feature-text'>
                        <img src={usersIcon}/>
                        <h3>Удобный поиск музыкантов</h3>
                        <p>Вы можете настроить фильтры под себя и искать только то, что вам нужно</p>
                    </div>
                    {resize === 'mobile' ? <></> : <img src={microImage}/>}
                </div>

                <div className='start-page-feature'>
                    <img src={phonesImage}/>
                    <div className='start-page-feature-text'>
                        <img src={messageIcon}/>
                        <h3>Встроенный мессенджер</h3>
                        <p>Найденным музыкантам можно с легкостью написать напрямую, договориться о коллабе, совместном концерте или просто поговорить о музыкальных вкусах</p>
                    </div>
                </div>

                <div className='start-page-feature'>
                    <div className='start-page-feature-text'>
                        <img src={musicIcon}/>
                        <h3>Стриминг</h3>
                        <p>Понравившийся контент можно добавить к себе в избранное</p>
                    </div>
                    <img src={microImage}/>
                </div>
            </div>
        </div>

        <div className='stripe'></div>

        <div className='comment-page-wrapper start-page-wrapper'>
            <div className='start-page-second-block'>
                <h1 className='start-page-h start-page-third-block'>Присоединяйтесь к миру музыки с 
                    <h1 className='start-page-h colored start-page-third-block'>Rising Notes</h1>
                </h1>
                <p className='start-page-p' style={{maxWidth: '764px'}}>Знакомьтесь с другими музыкантами
                и формируйте свое коммьюнити</p>
                <div className='start-page-buttons'>
                    <CustomButton text={'Регистрация'}  func={() => navigate('/registration')}/>
                    <button className='account-page-unfilled-button'  onClick={() => navigate('/login')}>
                        Вход
                    </button>
                </div>
                
            </div>
            {resize === 'mobile' ? <></> : <img alt={'background'} src={bgImageSecond} className='start-page-bg'/>}
        </div>
        <img draggable='false' src={stripe} className='down-stripe-start-page' alt=""/>
        </>
        
    )
}

export default StartPage;