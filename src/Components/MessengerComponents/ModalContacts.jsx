import CustomButton from "../CustomButton/CustomButton";
import Contact from "./Contact";
import { ReactComponent as CloseIcon } from '../../Images/x.svg';
import { useDispatch, useSelector } from "react-redux";
import { updateChatMemberList, updateIsModalContactsVisibe } from "../../Redux/slices/socketInfoSlice";
import { useEffect, useState } from "react";
import { axiosAuthorized } from "../App/App";
import { addUsersToChat } from "../../Api/Messenger";

function ModalContacts() {
    const isVisible = useSelector((state)=> state.socketInfo.isModalContactsVisibe);
    const isCreatingNewChat = useSelector((state) => state.socketInfo.isCreatingNewChat);
    const chatMemberList = useSelector((state) => state.socketInfo.chatMemberList);
    const chatInfo = useSelector((state) => state.socketInfo.chatInfo);

    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState(undefined);
    const [users, setUsers] = useState([...chatMemberList]);
    const [pickedUsers, setPickedUsers] = useState([...chatMemberList]);
    const [newUsers, setNewUsers] = useState([]);

    useEffect(() => {
        setUsers([...chatMemberList]);
        setPickedUsers([...chatMemberList]);
    }, [chatMemberList]);

    useEffect(() => {
        // Реагирование на поиск пользователей
        if (searchValue !== undefined && searchValue.length > 2) {
            getUsersByName(searchValue);
        } else {
            setUsers(pickedUsers);
        }
    }, [searchValue]);

    function handleCloseModalContacts() {
        dispatch(updateIsModalContactsVisibe(false));
    }

    async function getUsersByName(name) {
        // Получить пользователей по имени
        const response = await axiosAuthorized.get(`api/user/${name}`);
        const list = response.data.userInfoList;
        setUsers(list);
    }

    function handleClickOnUser(user) {
        // Добавить или убрать пользователя
        let members = [...pickedUsers];
        let list = newUsers;
        if (members.some(el => el.userId === user.userId)) {
            // members = members.filter(el => el.userId !== user.userId);
            // list = newUsers.filter(el => el.userId !== user.userId);
        } else {
            members.push({
                userId: user.userId,
                userName: user.userName,
                logoLink: user.logoLink
            });
            list.push({
                userId: user.userId,
                userName: user.userName,
                logoLink: user.logoLink
            });
        }
        setNewUsers(list);
        setPickedUsers(members);
    }

    async function changeMembersList() {
        // Обновить список участников чата и скрыть окно
        if (!isCreatingNewChat) {
            console.log(newUsers);
            await addUsersToChat(chatInfo?.id, newUsers);
        }
        dispatch(updateChatMemberList(pickedUsers));
        dispatch(updateIsModalContactsVisibe(false));
    }

    if (isVisible)
    return(
        <div className="modal-add-contacts-wrapper">
            <div className="modal-add-contacts">
                <div className="modal-add-contacts-row">
                    <p>Добавление участников</p>
                    <button className="close-modal-add-contacts" onClick={handleCloseModalContacts}>
                        <CloseIcon className="close-chat-img"/>
                    </button>
                </div>

                <div className="searchbar-container modal-add-contacts-searchbar">
                    <div>
                        <input 
                            className='searchbar' 
                            type="text" 
                            placeholder='Найти пользователя'
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="modal-contacts">
                    {users?.map(el => (
                        <Contact 
                            chatName={el.userName} 
                            id={el.userId} key={el.userId} 
                            logo={el.logoLink} 
                            isPicked={pickedUsers.some(user => user.userName === el.userName)}
                            onClick={() => handleClickOnUser(el)}/>
                    ))}
                </div>
                <div className="modal-add-contacts-row">
                    <CustomButton text={'Добавить участников'} func={changeMembersList}/>
                </div>
            </div>
        </div>
    )
}

export default ModalContacts;