import { useCookies } from "react-cookie";

const Message = ({id, text, sentAt, formatTime}) => {
    const [cookies, setCookies] = useCookies(['userId']);

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