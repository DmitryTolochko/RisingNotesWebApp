import arrowRight from '../../Images/artist-card/Chevron_Right.svg'

const ShowMoreBtn = ({
    collection,
    redirect,
    maxValue,
    activeTab,
    setActiveTab
}) => {
    return(
        <button className='featured-show-more' onClick={() => setActiveTab(redirect)}>
            {collection?.length > maxValue && activeTab=='main' ?
                    <>
                        <span>Смотреть все</span>
                        <img src={arrowRight} alt="" />
                    </>
                    : <></>
            }
        </button>
    )
}

export default ShowMoreBtn