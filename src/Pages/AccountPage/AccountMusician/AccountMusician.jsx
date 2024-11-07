import saveIcon from '../../../Images/account-page/save-icon.svg';
import linkIcon from '../../../Images/account-page/link-icon.svg';
import vkIcon from '../../../Images/account-page/vk-icon.svg';
import yandexIcon from '../../../Images/account-page/yandex-icon.svg';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomInput from '../../../Components/CustomInput/CustomInput';

export default function AccountMusician (props) {
    const [about, setAbout] = useState(props.about);
    const [vkLink, setVkLink] = useState(props.vkLink);
    const [yaMusicLink, setYaMusicLink] = useState(props.yaMusicLink);
    const [webSiteLink, setWebSiteLink] = useState(props.webSiteLink);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleSave = async (event) => {
        // вызов обновления информации о музыканте
        try {
            let newInfo = {
                about: about,
                vkLink: vkLink,
                yaMusicLink: yaMusicLink,
                webSiteLink: webSiteLink,
            }
            await props.handleRefreshMusicianInfo(newInfo);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    useEffect(() => {
        setIsButtonDisabled(checkInputs());
    }, [about, vkLink, yaMusicLink, webSiteLink])

    function checkInputs() {
        if (about === props.about && vkLink === props.vkLink &&
            yaMusicLink === props.yaMusicLink && webSiteLink === props.webSiteLink
        ) 
            return true;
        
        let arr = [vkLink, yaMusicLink, webSiteLink];
        let flag = false;
        let validRegex=/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        arr.forEach((input) => {
            if (input === undefined || 
                (input !== '' && !validRegex.test(input))
            )
                flag = true;
        })
        return flag;
    }

    return (
        <div className="account-page-user">
            <h2>Информация о музыканте</h2>
            <p>Описание</p>
            <textarea placeholder='Введите информацию о вас или вашей группе... ' 
                className='account-page-textarea' onChange={e => setAbout(e.target.value)}>
                {about}
            </textarea>
            <p>Ссылки</p>
            <div className='account-page-link-wrapper'>
                <CustomInput 
                    heading={<>
                        <img alt='icon' src={linkIcon} style={{marginTop: '-8px'}}/>
                        <p style={{color: '#787885', marginTop: '-8px'}}>Сайт</p>
                    </>}
                    placeholder='Введите ссылку... '
                    value={webSiteLink} 
                    onChange={e => setWebSiteLink(e.target.value)}
                    alertMessage='Неправильный вид ссылки'
                    validRegex={/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/}
                    isRequired={false}/>
            </div>

            <div className='account-page-link-wrapper'>
                <CustomInput
                    heading={<>
                        <img alt='icon' src={vkIcon} style={{marginTop: '-8px'}}/>
                        <p style={{color: '#787885', marginTop: '-8px'}}>Вконтакте</p>
                    </>}
                    placeholder='Введите ссылку... '
                    value={vkLink} 
                    onChange={e => setVkLink(e.target.value)}
                    alertMessage='Неправильный вид ссылки'
                    validRegex={/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/}
                    isRequired={false}/>
            </div>

            <div className='account-page-link-wrapper'>
                <CustomInput
                    heading={<>
                        <img alt='icon' src={yandexIcon} style={{marginTop: '-8px'}}/>
                        <p style={{color: '#787885', marginTop: '-8px'}}>Я.Музыка</p>
                    </>}
                    placeholder='Введите ссылку... '
                    value={yaMusicLink} 
                    onChange={e => setYaMusicLink(e.target.value)}
                    alertMessage='Неправильный вид ссылки'
                    validRegex={/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/}
                    isRequired={false}/>
            </div>

            <CustomButton 
                func={handleSave} 
                icon={saveIcon} 
                text={'Сохранить'} 
                success={'Сохранено'}
                disabled={isButtonDisabled}/>            
        </div>
    )
}