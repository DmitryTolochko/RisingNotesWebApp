import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { axiosAuthorized } from "../App/App";

const Message = ({id, text, sentAt, formatTime, readAt, messageId}) => {
    const [cookies, setCookies] = useCookies(['userId']);

    useEffect(() => {
        if (readAt === null && id !== cookies.userId) {
            axiosAuthorized.patch(`api/chat-message/${messageId}`);
        }
    }, []);

    // сообщение
    switch (id) {
        case cookies.userId:
            return (
                <span className="my-message" key={id}>
                    {text}
                    <p>{formatTime(sentAt)}</p>
                </span>
            )
    
        default:
            return (
                <span className="opponent-message" key={id}>
                    {text}
                    <p>{formatTime(sentAt)}</p>
                </span>
            )
    }
}

export default Message;