import { useEffect, useState } from "react";
import { axiosAuthorized } from "../App/App";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import saveIcon from '../../Images/account-page/save-icon.svg';

function PasswordWindow({visibility, func}) {
    const [oldPassword, setOldPassword] = useState(undefined);
    const [newPassword, setNewPassword] = useState(undefined);
    const [isVisible, setVisibility] = useState(visibility);

    const changeUserPassword = async () => {
        // обновление пароля пользователя
        try {
            await axiosAuthorized.patch('api/profile/password', {
                oldPassword: oldPassword, 
                newPassword: newPassword
            })
            func(false);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    useEffect(() => {
        setVisibility(visibility);
    }, [visibility]);

    function handleClose() {
        func(false);
    }

    return(
        <div className={isVisible ? "password-wrapper" : "password-wrapper hidden-password"}>
            <div className='password-window'>
            <span className="login-auth-form__label">Изменить пароль</span>
                <CustomInput 
                    heading={'Старый пароль'} 
                    placeholder="Начните вводить..."
                    value={oldPassword} 
                    onChange={e => setOldPassword(e.target.value)}
                    isRequired={true}
                    type={'password'}
                    />
                <CustomInput 
                    heading={'Новый пароль'} 
                    placeholder="Начните вводить..."
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    isRequired={true}
                    type={'password'}
                    />
                <div className="account-page-user-buttons">
                    <CustomButton func={changeUserPassword} icon={saveIcon} text={'Сохранить'} success={'Сохранено'}/>
                    <button className='account-page-unfilled-button' onClick={handleClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordWindow;