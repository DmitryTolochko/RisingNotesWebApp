
const FilterNotificationPopup = ({
    visible,
    notificationText, 
    actionButtonText, 
    actionButtonCallback=undefined
}) => {
    return(
        <div className="filters-notification-popup" style={{display: visible? 'flex' : 'none'}}>
            <h2>{notificationText}</h2>
            <p>Попробуйте изменить фильтры</p>
        </div>
    )
}

export default FilterNotificationPopup