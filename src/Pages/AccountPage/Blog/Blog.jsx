import { Link } from 'react-router-dom';
import VerticalVideoPreview from '../../../Components/Blog/VerticalVideoPreview';
import plus from '../../../Images/account-page/plus-icon.svg';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../../Components/App/App';
import VerticalClip from '../../../Components/VerticalClip/VerticalClip';
import { getClipRequestsForAuthor } from '../../../Api/ClipPublish';

function Blog(params) {
    const [cookies] = useCookies(['authorId']);
    const [verts, setVerts] = useState(undefined)

    useEffect(()=>{
        getClipRequestsForAuthor(true)
            .then(res=>setVerts(res))
            .catch(err=>console.log(err))
    }, [])



    return (
        <div className="account-page-user">
            <h2>Все видео</h2>
            <Link to={'/uploadvertvideo'} className='account-page-add-song'><img alt='icon' src={plus}/>Новое видео</Link>

            <div className="blog">
                {verts?.map(video=>(
                    <VerticalClip clipRequestId={video.id}/>
                ))}
            </div>
        </div>
    )
}

export default Blog;