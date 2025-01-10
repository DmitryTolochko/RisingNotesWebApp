import saveIcon from '../../../Images/account-page/save-icon.svg';
import editIcon from '../../../Images/account-page/edit-icon.svg';
import { useEffect, useState } from 'react';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomInput from '../../../Components/CustomInput/CustomInput';

export default function AccountUser (props) {
    const [userName, setUserName] = useState(props.userName);
    const [email, setEmail] = useState(props.email);
    const [oldPassword, setOldPassword] = useState(undefined);
    const [newPassword, setNewPassword] = useState(undefined);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    async function handleSave() {
        try {
            if (userName !== props.userName)
                await props.changeUserName(userName);
            if (email !== props.email)
                await props.changeUserEmail(email);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    useEffect(() => {
        setIsButtonDisabled(checkInputs());
    }, [userName, email])

    function checkInputs() {
        if (userName === props.userName && email === props.email) 
            return true;
        if (userName === undefined || userName === '' || email === undefined || email === '')
            return true;
        return false;
    }

    return (
        <div className="account-page-user">
            <h2>Основная информация</h2>
            <div className="account-page-user-inputs">
                <span className='account-page-user-input'>
                <CustomInput 
                    heading={'Имя пользователя'} 
                    placeholder="Введите ваш никнейм или имя"
                    value={userName} 
                    onChange={e => setUserName(e.target.value)}
                    isRequired={true}/>
                </span>
                <span className='account-page-user-input'>
                <CustomInput
                    heading={'Почта'}
                    placeholder="Введите вашу почту"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    isRequired={true}/>
                </span>
            </div>
            <div className="account-page-user-buttons">
                <CustomButton func={handleSave} icon={saveIcon} text={'Сохранить'} success={'Сохранено'} disabled={isButtonDisabled}/>

                <button className='account-page-unfilled-button'>
                    <img src={editIcon}/>
                    Изменить пароль
                </button>
            </div>

            <div className='password-window'>
                <h2>Изменить пароль</h2>
                <CustomInput 
                    heading={'Старый пароль'} 
                    placeholder="Начните вводить..."
                    value={oldPassword} 
                    onChange={e => setOldPassword(e.target.value)}
                    isRequired={true}/>
                <CustomInput 
                    heading={'Новый пароль'} 
                    placeholder="Начните вводить..."
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    isRequired={true}/>
                <div className="account-page-user-buttons">
                <CustomButton func={handleSave} icon={saveIcon} text={'Сохранить'} success={'Сохранено'}/>
                <button className='account-page-unfilled-button'>
                    Отмена
                </button>
                </div>
            </div>
            
        </div>
    )
}