import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilterValue } from "../../Redux/slices/filtersSlice";

function FilterBool(params) {
    const filters = useSelector((state)=>state.filters.value);
    const dispatch = useDispatch();
    const [gender, setGender] = useState(filters.gender);
    const [instrumental, setInstrumental] = useState(filters.instrumental);

    useEffect(() => {
        dispatch(updateFilterValue({
            filterId: 'gender', 
            filterValue: gender, 
        }));
        dispatch(updateFilterValue({
            filterId: 'instrumental', 
            filterValue: instrumental, 
        }));
    }, [instrumental, gender]);

    return(
        <>
        <div className="filterOption">
            <div className="filter-top">
                <div className="filter-top-start">
                    <div className="filter-dot"></div>
                    <span className="filter-name">Пол вокалиста</span>
                </div>
            </div>
            <form className="filters-form">
                <select className="filters-input" onChange={e => setGender(e.target.value)} value={gender}>
                    <option value={0}>Не имеет значения</option>
                    <option value={2}>Мужской</option>
                    <option value={1}>Женский</option>
                </select>
            </form>
        </div>
        <div className="filterOption">
            <div className="filter-top">
                <div className="filter-top-start">
                    <div className="filter-dot"></div>
                    <span className="filter-name">Дополнительно</span>
                </div>
            </div>
            <div className="filter-checkbox-container">
                <div className="filter-checkbox">
                    <input type="checkbox" onClick={e => {
                        setInstrumental(e.target.checked)
                    }} checked={instrumental}/>
                    <label>Инструментальный трек</label>
                </div>
            </div> 
        </div>
        </>
    )
}

export default FilterBool;