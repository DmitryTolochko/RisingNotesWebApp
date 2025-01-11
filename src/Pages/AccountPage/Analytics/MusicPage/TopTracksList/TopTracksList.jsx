import TopTrackListItem from "./TopTrackListItem";

function TopTracksList({tracks}) {
    return(
        <ul className='tt-ul'>
            {tracks.map((track, index)=>(
                <TopTrackListItem key={index} trackId={track} index={index}/>
            ))} 
        </ul>
    )
}

export default TopTracksList;