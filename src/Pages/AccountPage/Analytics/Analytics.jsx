import { useState } from "react";
import AnalyticsTabSelector from "./PageComponents/AnalyticsTabSelector";
import Chart from "./PageComponents/Chart/Chart";
import ActivityPage from "./ActivityPage/ActivityPage";

function Analytics() {
    const [activeTabId, setActiveTabId] = useState(0)

    return ( 
        <div className="account-page-user">
            <h2>Аналитика</h2>
            <AnalyticsTabSelector activeTabId={activeTabId} setActiveTabId={setActiveTabId}/>
            {activeTabId===0 && <ActivityPage/> }
            {activeTabId===1 && <>1</>}
            {activeTabId===2 && <>2</>}
        </div>
    );
}



export default Analytics;