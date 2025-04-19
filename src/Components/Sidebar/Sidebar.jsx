import { api, axiosAuthorized, axiosPictures } from '../App/App'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'

import { useSelector, useDispatch } from 'react-redux'
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { updateValue } from '../../Redux/slices/searchSlice'

import searchIcon from '../../Images/sidebar/Vector.svg';
import wave from '../../Images/sidebar/vave.svg';
import warning from '../../Images/sidebar/warning.svg';
import like from '../../Images/sidebar/like.svg';
import placeholder from '../../Images/main-placeholder.png';
import subsIcon from '../../Images/sidebar/subs-icon.svg';
import messengerIcon from '../../Images/sidebar/messenger.png';

import SidebarCollapser from './SidebarCollpaser/SidebarCollapser'
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';
import useMenuToggle from '../../Hooks/useMenuToggle/useMenuToggle';

import './Sidebar.css';
import { updatePlayerQueueVisibility } from '../../Redux/slices/playerQueueSlice'
import { shortenText } from '../../Tools/Tools'


function Sidebar(props) {
   const [search, setSearch] = useState(searchIcon)
   const [searchQuery, setSearchQuery] = useState('')
   const [playlistsInfo, setPlaylistsInfo] = useState([]); 
   const navigate = useNavigate();
   const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);
   
   const {cleanQuery} = useSearchClean()
   const {collapsed, toggler} = useMenuToggle()

   const dispatch = useDispatch()
   const searchInput = useSelector((state) => state.searchInput.value)
   const playlists = useSelector((state) => state.playlists.value)
   
   useEffect(()=>{
      dispatch(updateValue(searchQuery))
   },[searchQuery]);

   useEffect(() => {
      if (playlists !== undefined)
         getPlaylistsInfo();
   }, [playlists])

   useEffect(() => {
   }, [collapsed])

 

   async function getPlaylistsInfo() {
      // Получить или обновить информацию о плейлистах
      try {
         const arr = await Promise.all(playlists.map(async (el) => {
            let response = await axiosAuthorized.get(`api/playlist/${el.id}`)
            .catch(err => console.log(err));
            let img = await axiosPictures.get(api + `api/playlist/${el.id}/logo/link`)
            .then(resp => {return resp?.data?.presignedLink})
            .catch(err => {return placeholder});

            return {
               name: response?.data?.name,
               id: el.id,
               img: img
            };
         }));
      
         setPlaylistsInfo(arr);
      }
      catch (err) {
         console.log(err);
      }
   }     

   const handleQueryChange = (e) =>{
      setSearchQuery(e.target.value)
   }

   async function addNewPlaylist() {
      // Добавить новый плейлист
      if (!cookies?.role) {
         navigate('/login');
      }
      let id = 0
      let formData = new FormData();
      formData.append('Name', 'Новый плейлист')
      await axiosAuthorized.post('api/playlist', formData, { headers: {
          "Content-Type": "multipart/form-data",
      }})
      .then (
         response => {
            id = response.data.id
            dispatch(updatePlaylistsValue([...playlists, {id: id, name: 'Новый плейлист', isPrivate: true}]))
         }
      )
      navigate(`/playlist/${id}`)
  };

   const handleQuerySubmit = (e) =>{
      e.preventDefault()
   }

   const sidebarClickHandler = () =>{
      cleanQuery()
   }

   return(
    <div className={collapsed ? "sidebar collapse" : "sidebar"} id='sidebar'>
      <SidebarCollapser collapseFunc={toggler} collapsed={collapsed}/>
      <div className="sidebar-content">
         <div className="searchbar-container">
            <form>
               <button className='searchbar-submit' type='submit'>
                  <img src={search} alt="" draggable='false' />
               </button>
               <input 
                  className='searchbar' 
                  type="text" 
                  placeholder='Поиск'
                  value={searchInput}
                  onSubmit={handleQuerySubmit}
                  onInput={handleQueryChange}
               />
            </form>
         </div>
         <div className="music-container">
            <span className="section_title">Музыка</span>
            <nav className='music-nav'>
               <ul className="nav-links" onClick={() => dispatch(updatePlayerQueueVisibility(false))}>
                  <li>
                     <NavLink draggable='false' onClick={sidebarClickHandler} className ={({ isActive }) => (isActive ? 'nav-link wave active' : 'nav-link wave' )} 
                     to={cookies.role ? '/' : 'explore'} 
                     style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                        <img src={wave} alt="" className="nav-icon" draggable='false' />
                        <span>Моя волна</span>
                     </NavLink>
                  </li>
                  <li>
                     <NavLink draggable='false' onClick={sidebarClickHandler} className ={({ isActive }) => (isActive ? 'nav-link fav active' : 'nav-link fav ' )}
                     to={'/featured'} 
                     style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                        <img src={like} alt="" className="nav_icon" draggable='false' />
                        <span >Избранное</span>
                     </NavLink>
                  </li>
                  <li> 
                     <NavLink draggable='false' onClick={sidebarClickHandler} className ={({ isActive }) => (isActive ? 'nav-link remove active' : 'nav-link remove ' )}
                     to={'/messenger'} 
                     style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                        <img src={messengerIcon} alt="" className="nav-icon" draggable='false' />
                        <span>Мессенджер</span>
                     </NavLink>
                  </li>
               </ul>
            </nav>
         </div>
         {cookies.accessToken !== undefined || cookies.role !== undefined || cookies.userId !== undefined ? 
            <div className="playlists-container">
            <span className="section-title">Плейлисты</span>
            <ul className="sidebar-playlists" onClick={() => dispatch(updatePlayerQueueVisibility(false))}>
               {playlistsInfo.map((pl => 
                  <li className='sidebar-playlist' key={pl.id}>
                     <NavLink onClick={()=>sidebarClickHandler()} draggable='false' to={`/playlist/${pl.id}`} className='sidebar-playlist-name' 
                        style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                           <img draggable='false' src={pl.img}/>
                           {shortenText(pl.name, 15)}
                     </NavLink>
                  </li>
               ))}
            </ul>
            
            <li className='add-playlist' onClick={addNewPlaylist}>
               <span className="add-playlist-icon">+</span>
               <span className='sidebar-playlist-name'> Добавить плейлист</span>
            </li>
         </div> :
         <></>}
      </div>
    </div>
   )
}


export default Sidebar;