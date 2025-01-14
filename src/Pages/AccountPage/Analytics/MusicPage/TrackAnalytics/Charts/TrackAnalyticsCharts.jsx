import Chart from "../../../PageComponents/LineChart/Chart";
import Bar from "../../../PageComponents/BarChart/BarChart";
import { useState, useEffect } from "react";
import { axiosAuthorized } from "../../../../../../Components/App/App";
import moment from "moment";


function TrackAnalyticsCharts({
    songId
}) {
    const [fromDate, setFromDate] = useState(30)
    const [datasetForAudition, setDatasetForAudition] = useState({
        labels:[{ data: [] }],
        data:[]
    })

    const fetchTrackAuditionsByPeriod = async (fromDate, songId) =>{
        const date = moment().subtract(fromDate, 'days').format('YYYY-MM-DD')
        await axiosAuthorized.get(`/api/analytics/song/${songId}/audition/for-range?fromDate=${date}`)
            .then(response => {
                prepareDatasetForAudition(response.data.perDayAuditionCountList)
            })
            .catch(error=>console.log(error))
    }

    const prepareDatasetForAudition = (data) =>{    
        const result = {
            labels:[{ data: [] }],
            data:[]
        }
       
        data.forEach((el)=>{
            const date = el.date
            const count = el.auditionCount
            const dateParsed = moment(date).format('DD MMM YYYY')

            result.labels[0].data.push(dateParsed)
            result.data.push(count)
        })
        setDatasetForAudition(result)
    }

    useEffect(()=>{
        fetchTrackAuditionsByPeriod(fromDate, songId)
    },[fromDate, songId])

    return(
        <div className="cw-bottom-charts">
                <Bar
                    barId={'tac-1'}
                    dataValues={datasetForAudition.data} 
                    dataLabels={datasetForAudition.labels[0].data} 
                    title={'Количество прослушиваний'}
                    colorFrom={'rgba(254, 17, 112, 1)'}
                    colorTo={'rgba(254, 17, 112, 0)'}
                    onRangeUpdate={(newPeriod) => setFromDate(newPeriod)}
                />
                <Bar
                    barId={'tac-2'}
                    dataValues={[1, 2, 3, 5, 8, 10]} 
                    dataLabels={[1, 2, 3, 5, 8, 10]} 
                    title={'Добавили в избранное'}
                    colorFrom={'rgba(1, 179, 255, 1)'}
                    colorTo={'rgba(1, 179, 255, 0)'}
                    onRangeUpdate={()=>console.log('second chart update')}
                />
        </div>
    )
}

export default TrackAnalyticsCharts;