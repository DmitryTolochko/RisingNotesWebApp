import { useEffect, useState } from "react";
import Chart from "../PageComponents/LineChart/Chart";
import Bar from "../PageComponents/BarChart/BarChart";
import { axiosAuthorized } from "../../../../Components/App/App";
import './ActivityPage.css'
import moment from "moment";

function ActivityPage() {
    const [fromDate, setFromDate] = useState(7)
    const [datasetForAudition, setDatasetForAudition] = useState({
        labels:[{ data: [] }],
        data:[]
    })

    const getAuditionCount = async () =>{
        const date = moment().subtract(fromDate, 'days').format('YYYY-MM-DD')
        await axiosAuthorized.get(`/api/analytics/song/audition/for-range?fromDate=${date}`)
            .then(response =>{
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
        getAuditionCount()
    },[fromDate])


    // Моковые данные для двух нижних графиков
    const datasetListen = {
        labels:[{ data: [1, 2, 3, 5, 8, 10] }],
        data:[2, 5.5, 2, 8.5, 1.5, 5]
    }

    return ( 
        <div className="charts-wrapper">
            <p>***Данные могут быть неверны***</p>
            <div className="cw-top-chart">
                <Bar
                    barId={'ap-1'}
                    dataValues={datasetForAudition.data} 
                    dataLabels={datasetForAudition.labels[0].data} 
                    title={'Прослушивания'}
                    colorFrom={'rgba(254, 17, 112, 1)'}
                    colorTo={'rgba(254, 17, 112, 0)'}
                    onRangeUpdate={(newPeriod) => setFromDate(newPeriod)}
                    fromPeriod={fromDate}
                />
            </div>
            <div className="cw-bottom-charts">

            {/* Лучше поменять на Bar. Эти плохо работают с датами */}
                <Chart
                    id={1}
                    title={'Добавили в избранное'} 
                    dataset={datasetListen}
                    height={300}
                    colorFrom={'rgba(1, 179, 255, 1)'}
                    colorTo={'rgba(1, 179, 255, 0)'}
                    defaultRangeDays={30}
                />
                <Chart
                    id={2}
                    title={'Подписчики'} 
                    dataset={datasetListen}
                    height={300}
                    colorFrom={'rgba(1, 179, 255, 1)'}
                    colorTo={'rgba(1, 179, 255, 0)'}
                    defaultRangeDays={30}
                />
            </div>

        </div>
    );
}

export default ActivityPage;