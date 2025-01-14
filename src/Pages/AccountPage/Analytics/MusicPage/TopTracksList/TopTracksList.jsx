import TopTrackListItem from "./TopTrackListItem";

function TopTracksList({data}) {

    if(data.length===0){
        return(
            <>Вы еще не загрузили ни одного трека</>
        )
    }
    
    return( 
        <ul className='tt-ul'>
            {data.map((dataEl, index)=>(
                <TopTrackListItem key={index} songId={dataEl.songId} songName={dataEl.songName} auditionCount={dataEl.auditionCount} index={index}/>
            ))} 
        </ul>
    )

}

export default TopTracksList;