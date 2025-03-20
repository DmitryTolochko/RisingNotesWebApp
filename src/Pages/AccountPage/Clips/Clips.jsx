import { Link } from "react-router-dom";
import Clip from "../../../Components/Clip/Clip";
import plus from '../../../Images/account-page/plus-icon.svg';
import { useCookies } from "react-cookie";
import { useEffect,useState } from "react";
import { deleteClipRequest, getClipRequestInfo, getClipRequestsForAuthor } from "../../../Api/ClipPublish";

export default function Clips() {
    const [clips, setClips] = useState(undefined)

    useEffect(()=>{
        getClipRequestsForAuthor()
        .then(list => getAllRequestsInfo(list));
    }, []);

    async function getAllRequestsInfo(list) {
        let infoList = [];
        for (let el of list) {
            let newInfo = await getClipRequestInfo(el.id);
            if (newInfo) {
                infoList.push({ ...el, ...newInfo });
            }
        }
        setClips(infoList);
    }

    return (
        <div className="account-page-user">
            <h2>Все клипы</h2>
            <Link to={'/uploadvideo'} className='account-page-add-song'><img alt='icon' src={plus}/>Новый видеоклип</Link>

            <div className="artist-clips">
                {clips?.map((clip,index) => (
                    <Clip 
                        key={index} 
                        clipId={clip.clipId} 
                        clipRequestId={clip.id}
                        authorId={clip.authorId} 
                        songId={clip.songId} 
                        name={clip.title} 
                        isArtist={true}
                        status={clip.status}/>
                ))}
            </div>
        </div>
    )
}