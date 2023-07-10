import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Playlist from '../../Components/Playlist';
import Song from '../../Components/Song';
import newPlaylist from '../../Images/featured/new-playlist.png';
import menu from '../../Images/controller/menu.svg'

class Featured extends React.Component {
    render() {
        return (
            <div className='black-page'>
                <div className='side-bar'><img alt='menu' src={menu}/></div>
                <div className='featured'>
                    <BackButton/>
                    <h2>Плейлисты</h2>
                    <div className='playlists'>
                        <Playlist/>
                        <Playlist/>
                        <Playlist/>
                        <img className='new-playlist' alt='add new playlist' src={newPlaylist}/>
                    </div>

                    <h2>Все треки</h2>
                    <div className='tracks'>
                        <Song/>
                        <Song/>
                        <Song/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Featured