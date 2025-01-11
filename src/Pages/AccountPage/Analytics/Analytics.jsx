import { useState } from "react";
import AnalyticsTabSelector from "./PageComponents/AnalyticsTabSelector";

import ActivityPage from "./ActivityPage/ActivityPage";
import AudiencePage from "./AudiencePage/AudiencePage";
import MusicPage from "./MusicPage/MusicPage";

function Analytics() {
    const [activeTabId, setActiveTabId] = useState(0)

    return ( 
        <div className="account-page-user">
            <h2>Аналитика</h2>
            <AnalyticsTabSelector activeTabId={activeTabId} setActiveTabId={setActiveTabId}/>
            {activeTabId===0 && <ActivityPage/> }
            {activeTabId===1 && <AudiencePage/>}
            {activeTabId===2 && <MusicPage/>}
        </div>
    );
}



export default Analytics;