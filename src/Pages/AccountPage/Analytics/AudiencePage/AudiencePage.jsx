import Pie from "../PageComponents/PieChart/PieChart";
import Bar from "../PageComponents/BarChart/BarChart";
import CountriesList from "../PageComponents/CountriesList/CountriesList";
import ChartPeriodSelector from "../PageComponents/LineChart/ChartPeriodSelector";
import { useEffect, useState } from "react";
import './AudiencePage.css'

function AudiencePage() {
    const [selectedPeriod, setSelectedPeriod] = useState(30)

    useEffect(()=>{
        //Обновлять данные по изменеию периода
    },[selectedPeriod])

    //Данные для пола
    const genderData = [
        { label: 'Мужской', value: 2400 },
        { label: 'Женский', value: 4567 },
    ];
    const genderColors=['#01B3FF','#FE1170']

    //Данные для стран
    const countriesData = [
        { label: 'Россия', value: 62 },
        { label: 'Белоруссия', value: 1 },
        { label: 'Казахстан', value: 5 },
        { label: 'Кыргызстан', value: 3 },
        { label: 'Туркменистан', value: 1 },
    ]

    //Данные для возраста
    const ageDataValues = [60, 90, 150, 45, 20,12,5]
    const ageDataLabels = ['до 18', '19-23', '24-28', '29-35', '36-45', '46-55', 'от 56']

    return ( 
        <div className="audience-wrapper">
            <ChartPeriodSelector currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod}/>
            <div className="audience-top-row">
                <Pie data={genderData}colors={genderColors}/>
                <CountriesList data={countriesData}/>
            </div>
            <Bar 
                dataValues={ageDataValues} 
                dataLabels={ageDataLabels} 
                label={'Возраст'}
                color={'#FE1170'}
            />
        </div>
    );
}

export default AudiencePage;