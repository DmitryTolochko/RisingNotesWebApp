import Chart from "../PageComponents/Chart/Chart";
import './ActivityPage.css'

function ActivityPage() {
    const datasetListen = {
        labels:[{ data: [1, 2, 3, 5, 8, 10] }],
        data:[2, 5.5, 2, 8.5, 1.5, 5]
    }

    return ( 
        <div className="charts-wrapper">
            <div className="cw-top-chart">
                <Chart
                    id={0}
                    title={'Прослушивания'} 
                    dataset={datasetListen}
                    height={300}
                    colorFrom={'rgba(254, 17, 112, 1)'}
                    colorTo={'rgba(254, 17, 112, 0)'}
                    defaultRangeDays={7}
                />
            </div>
            <div className="cw-bottom-charts">
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