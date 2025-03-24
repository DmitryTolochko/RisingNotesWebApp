import VerticalClip from "../VerticalClip/VerticalClip";
import './Blog.css';
import { useState, useEffect } from "react";
import { axiosUnauthorized } from "../App/App";
import { useParams } from "react-router-dom";
function Blog({artistId, count=0, offset=0}) {
    const [verts, setVerts] = useState(undefined);
    const params = useParams();

    const getArtistVert = async ()=> {
        let response = await axiosUnauthorized.get(`api/short-video/by-author/${artistId}` + (count == 0 ? '' : `?count=${count}&offset=${offset}`))
        .catch(err => {
            throw err;
        });
        let result = response?.data.shortVideoList;
        return result;
    }

    useEffect(()=>{
        getArtistVert()
            .then(res=>setVerts(res))
            .catch(err=>console.log(err))
    },[params])

    return (
        <div className="blog">
            {verts?.map((video)=>(
                <VerticalClip key={video.id} clipId={video.id} authorId={video.authorId} authorName={video.authorName}/>
            ))}
        </div>
    )
}

export default Blog;