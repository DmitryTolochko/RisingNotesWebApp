import { ReactComponent as FilterIcon } from '../../Images/player/FilterBtn.svg';
import closeIcon from '../../Images/music-explorer/close.svg';
import './Filters.css';
import { useEffect, useState } from 'react';
import { getGenres, getLanguages, getMoods } from '../Player/FilterComponent/APICallers/FiltersGetter';
import CustomButton from '../CustomButton/CustomButton';
import FilterElement from './FilterElement';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterVisibility, updateFilterValue } from '../../Redux/slices/filtersSlice';
import { updatePlayerQueueName } from '../../Redux/slices/playerQueueSlice';
import { extractSongsIdsList, songsByFiltersGetter } from '../Player/FilterComponent/FIlters/Filters';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { musicIsPlayingSlice, updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import FilterDuration from './FilterDuration';
import FilterBool from './FilterBool';
import { useCookies } from 'react-cookie';

function Filters({setFiltersApplied}) {
    const filters = useSelector((state)=>state.filters.value);
    const dispatch = useDispatch();

    const [genreOptions,setGenreOptions] = useState(null);
    const [langOptions,setLangOptions] = useState(null);
    const [moodOptions,setMoodOptions] = useState(null);

    const [genreList, setGenreList] = useState(filters.genre);
    const [langList, setLangList] = useState(filters.language);
    const [moodList, setMoodList] = useState(filters.mood);
    
    const [genrePredicate, setGenrePredicate] = useState(filters.genreOrAnd);
    const [langPredicate, setLangPredicate] = useState(filters.languageOrAnd);
    const [moodPredicate, setMoodPredicate] = useState(filters.moodOrAnd);

    const [cookies, setCookies] = useCookies(['role']);

    useEffect(() => {
        // получение опций для выпадающих списков
        async function fetchFilters() {
            await Promise.all([
                getGenres().then(res=>setGenreOptions(res)).catch(err=>console.log(err)),
                getLanguages().then(res=>setLangOptions(res)).catch(err=>console.log(err)),
                getMoods().then(res=>setMoodOptions(res)).catch(err=>console.log(err))
            ])
        }
        fetchFilters();
    }, []); 

    useEffect(() => {
        // обновление фильтров
        dispatch(updateFilterValue({
            filterId: 'genre', 
            filterValue: genreList, 
            filterOrAnd: genrePredicate
        }));
        dispatch(updateFilterValue({
            filterId: 'language', 
            filterValue: langList, 
            filterOrAnd: langPredicate
        }));
        dispatch(updateFilterValue({
            filterId: 'mood', 
            filterValue: moodList, 
            filterOrAnd: moodPredicate
        }));
    }, [genreList, langList, moodList, genrePredicate, langPredicate, moodPredicate]);

    async function applyFilters() {
        // применение фильтров
        dispatch(updateMusicIsPlayingValue(false));
        await songsByFiltersGetter(filters, cookies.role ? true : false)
        .then(res=> {
            if(res == -1 || res == [] ){
                return;
            }
            const songs = extractSongsIdsList(res);
            dispatch(updateSongsValue(songs));
            dispatch(updatePlayerQueueName('Поиск новой музыки'));
            if (songs.length > 0) {
                dispatch(updateCurrentSongValue(songs[0]));
                dispatch(updateMusicIsPlayingValue(true));
                hideFilters();
            }   
            
            setFiltersApplied(true);
        })
        .catch(err=> {
            console.log('Error while getting songs by filters: \n')
            console.log(err)
        })
    };

    function hideFilters() {
        dispatch(setFilterVisibility(false));
    };

    return (
        <div className={filters.visibility ? "explorer-filters" : "explorer-filters hidden-filters"}>
            <button className='close-explorer-filters' onClick={hideFilters}><img alt='close' src={closeIcon}/></button>
            <span className='filters-h'>
                <FilterIcon stroke='white'/>
                Фильтры
            </span>
            <div className="filters-settings">
                <FilterElement 
                    name="Жанры"
                    availableOptions={genreOptions}
                    list={genreList}
                    setList={setGenreList}
                    placeholder={'Введите жанр...'}
                    predicate={genrePredicate}
                    setPredicate={setGenrePredicate}/>
                <FilterElement 
                    name="Языки"
                    availableOptions={langOptions}
                    list={langList}
                    setList={setLangList}
                    placeholder={'Введите язык...'}
                    predicate={langPredicate}
                    setPredicate={setLangPredicate}/>
                <FilterElement 
                    name="Настроение"
                    availableOptions={moodOptions}
                    list={moodList}
                    setList={setMoodList}
                    placeholder={'Введите настроение...'}
                    predicate={moodPredicate}
                    setPredicate={setMoodPredicate}/>
                <FilterDuration/>
                <FilterBool/>
            </div>
            <div className="filters-settings">
                <CustomButton 
                    text={'Применить фильтры'} 
                    success={'Изменить фильтры'} 
                    errorText={'Песен не найдено'}
                    reusable={true}
                    func={applyFilters}/>
            </div>
        </div>
    )

}

export default Filters;