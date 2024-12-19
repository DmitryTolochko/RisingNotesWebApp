import newPlaylist from '../../Images/featured/newplaylist.png';
import { axiosAuthorized } from '../../Components/App/App';
import { api } from '../../Components/App/App';
import { useDispatch } from 'react-redux';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { useNavigate } from 'react-router-dom';
import Playlist from '../../Components/Playlist';
import ShowMoreBtn from './ShowMoreBtn';

const Playlists = ({playlists, activeTab, setActiveTab}) =>{

    const playlistsToShow = playlists?.length>5 && activeTab=='main' ? playlists.slice(0,5) : playlists
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function addNewPlaylist() {
        let id = 0
        let formData = new FormData();
        formData.append('Name', 'Новый плейлист')
        await axiosAuthorized.post(api + 'api/playlist', formData, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .then (
            response => {
                id = response.data.id
                dispatch(updatePlaylistsValue([...playlists, id]))
            }
        )
        navigate(`/playlist/${id}`)
    };

    
    return(
        <section className='featured-section'>
            <div className="featured-section__title_wrapper">
                <h2 className='featured-section__title'>Плейлисты</h2>
                <ShowMoreBtn collection={playlists} redirect={'playlists'} maxValue={5} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            <div className="playlists">
                {playlistsToShow?.map(el => (
                    <Playlist id={el}/>
                ))}
                <div draggable='false' className='playlist'>
                    <img draggable='false' className='new-playlist' alt='add new playlist' src={newPlaylist} onClick={addNewPlaylist}/>
                </div>
            </div>
        </section>
    )
}

export default Playlists