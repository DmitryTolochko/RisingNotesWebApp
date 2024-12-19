const AnalyticsTabSelector = ({activeTabId, setActiveTabId}) =>{
    const navTabs = [{id:0, label:'Активность'}, {id:1, label:'Аудитория'}, {id:2, label:'Музыка'}]

    return(
        <div className="account-page-menu">
            <a onClick={() => setActiveTabId(0)} 
                className={activeTabId === 0 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                {navTabs[0].label}
            </a>
            <a onClick={() => setActiveTabId(1)} 
                className={activeTabId === 1  ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                {navTabs[1].label}
            </a>
            <a onClick={() => setActiveTabId(2)} 
                className={activeTabId === 2  ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                {navTabs[2].label}
            </a>
        </div>
    )
}

export default AnalyticsTabSelector