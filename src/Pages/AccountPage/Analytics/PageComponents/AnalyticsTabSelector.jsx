const AnalyticsTabSelector = ({activeTabId, setActiveTabId}) =>{
    const navTabs = [
        {id:0, label:'Активность'},
        {id:1, label:'Аудитория'},
        {id:2, label:'Музыка'}
    ]

    return(
        <div className="account-page-menu">
            {navTabs.map((el,index)=>(
                <a onClick={() => setActiveTabId(el.id)} 
                    key={index}
                    className={activeTabId === el.id ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                    {el.label}
                </a>
            ))}
        </div>
    )
}

export default AnalyticsTabSelector