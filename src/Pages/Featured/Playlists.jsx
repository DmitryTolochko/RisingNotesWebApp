import newPlaylist from '../../Images/featured/newplaylist.png';
import { useDispatch } from 'react-redux';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { useNavigate } from 'react-router-dom';
import Playlist from '../../Components/Playlist/Playlist';
import ShowMoreBtn from './ShowMoreBtn';
import { createNewPlaylist } from '../../Api/Playlist';

const Playlists = ({playlists, activeTab, setActiveTab, customHeading='Плейлисты', isNewHidden=false}) =>{
    const playlistsToShow = playlists?.length> 5 && activeTab=='main' ? playlists.slice(0,5) : playlists
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function addNewPlaylist() {
        let id = await createNewPlaylist('Новый плейлист');
        dispatch(updatePlaylistsValue([...playlists, {id: id, name: "Новый плейлист", isPrivate: true}]));
        navigate(`/playlist/${id}`);
    };
    
    return(
        <section className='featured-section'>
            <div className="featured-section__title_wrapper">
                <h2 className='featured-section__title'>{customHeading}</h2>
                <ShowMoreBtn collection={playlists} redirect={'playlists'} maxValue={5} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            <div className="playlists">
                {!isNewHidden ? (
                    <div draggable='false' className='playlist'>
                        <img draggable='false' className='new-playlist' alt='add new playlist' src={newPlaylist} onClick={addNewPlaylist}/>
                    </div>
                ) : (<></>)}
                {playlistsToShow?.map(el => (
                    <Playlist id={el.id} isPrivate={!isNewHidden ? el.isPrivate : true}/>
                ))}
            </div>
        </section>
    )
}

export default Playlists