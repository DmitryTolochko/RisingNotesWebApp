import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DeleteIcon } from '../../Images/x.svg';
import { updateChatImages } from "../../Redux/slices/socketInfoSlice";

export default function ChatImage() {
    const chatImages = useSelector((state) => state.socketInfo.chatImages);
    const [currImage, setCurrImage] = useState(undefined);
    const [count, setCount] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        if (chatImages) {
            setCurrImage(chatImages[0]);
            setCount(0);
        }
    }, [chatImages]);

    function handleCloseImages() {
        dispatch(updateChatImages(undefined));
        setCurrImage(undefined);
        setCount(0);
    }

    function handleNextImage() {
        if (count + 1 >= chatImages?.length) {
            handleCloseImages();
        } else {
            setCurrImage(chatImages[count + 1]);
            setCount(count + 1);
        }
    }

    if (currImage)
    return (
        <div className="chat-image">
            <DeleteIcon className="message-input-file-delete chat-image-close" onClick={handleCloseImages}/>
            <img src={currImage} onClick={handleNextImage}/>
        </div>
    )
}