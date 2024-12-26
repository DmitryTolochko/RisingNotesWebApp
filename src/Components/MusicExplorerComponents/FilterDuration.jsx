import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilterValue } from "../../Redux/slices/filtersSlice";

function FilterDuration() {
    const filters = useSelector((state)=>state.filters.value);
    const dispatch = useDispatch();
    const[duration, setDuration] = useState(filters.duration);

    const handleDurationChange = (e) =>{
        setDuration(e);
    }

    useEffect(() => {
        dispatch(updateFilterValue({
            filterId: 'duration', 
            filterValue: duration, 
        }));
    }, [duration]);

    return(
        <div className="filterOption">
            <div className="filter-top">
                <div className="filter-top-start">
                    <div className="filter-dot"></div>
                    <span className="filter-name">Длительность</span>
                </div>
            </div>
            <form className="filters-form">
                <select className="filters-input" id="durations" onChange={e => handleDurationChange(e.target.value)} value={duration}>
                    <option value="any">Не имеет значения</option>
                    <option value="less-than-minute">Меньше 1:00</option>
                    <option value="minute-five">От 1:00 до 5:00</option>
                    <option value="more-than-five">Больше 5:00</option>
                </select>
            </form>
        </div>
    )
}

export default FilterDuration;