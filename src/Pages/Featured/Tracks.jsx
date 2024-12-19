import Song from '../../Components/Song/Song';
import { useDispatch, useSelector } from 'react-redux';
import ShowMoreBtn from './ShowMoreBtn';
import { updateSongsValue} from '../../Redux/slices/songsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import { updatePlayerQueueName } from '../../Redux/slices/playerQueueSlice';


const Tracks = ({songs, activeTab, setActiveTab, featured}) =>{
    const songsToShow = songs?.length>5 && activeTab=='main' ? songs.slice(0,5) : songs
    const dispatch = useDispatch()

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let arr = featured.slice(featured.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
        dispatch(updatePlayerQueueName('Избранные треки'));
    }

    return(
        <section className='featured-section'>
            <div className="featured-section__title_wrapper">
                <h2 className='featured-section__title'>Треки</h2>
                <ShowMoreBtn collection={songs} redirect={'tracks'} maxValue={5} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            <div className='tracks'>
                {songsToShow.map(el => (
                    <Song 
                        id={el.id} 
                        name={el.name} 
                        duration={el.durationMs} 
                        artist={el.authorName} 
                        genres={el.genreList}
                        onClick={updatePlayableList}
                    />
                ))}
                {songs.length === 0 ? <p style={{color: '#FE1170'}}>Список пуст</p> : <></>}
            </div>
        </section>
    )
}

export default Tracks