import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateVideoPlayerValue } from "../../Redux/slices/videoPlayerSlice";
import { api } from "../App/App";

//query params
function ClipView() {
    const { id } = useParams()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(
            updateVideoPlayerValue(api + `api/music-clip/${id}/file`)
        )
    },[])

    return ( 
    <section style={{height:'100vh',}}>
    </section> 
    );
}

export default ClipView;