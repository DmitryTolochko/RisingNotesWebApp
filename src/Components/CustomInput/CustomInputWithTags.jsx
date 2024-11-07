import React, { useRef } from 'react';
import { useEffect, useState } from "react";
import errorImg from '../../Images/error.svg';

function CustomInputWithTags({
    list, 
    setList, 
    placeholder, 
    availableOptions, 
    heading, 
    alertMessage='Выберите по крайней мере один тег'}){

    const select = useRef();
    
    const [currentTag, setCurrentTag] = useState(undefined);
    const [currentList, setCurrentList] = useState(list);
    const [filteredOptions, setOptions] = useState(availableOptions);

    function addTag(fastCopy='') {
        let tag = currentTag;
        if (fastCopy !== '') {
            tag = fastCopy;
        }
        // добавление тега
        if (tag != '' && availableOptions.includes(tag)) {
            if (currentList === undefined) {
                var arr = [tag];
            } else {
                var arr = [...currentList, tag];
            }
            setCurrentList(e => e = arr);
            setCurrentTag(undefined);
            setList(arr);
        }
    }

    function deleteTag(tag) {
        // удаление тега
        let arr = currentList.filter(el => el != tag);
        setCurrentList(e => e = arr);
        setList(arr);
    }

    useEffect(() => {
        // Изменение списка предложенных тегов
        if (currentTag !== undefined) {
            let arr = availableOptions.filter(e => e.toLowerCase().includes(currentTag.toLowerCase()));
            setOptions(arr);
            select.current.className = "input-options";
        }
        else {
            select.current.className = "hidden-options";
        }
    }, [currentTag]);

    function handleInputChange(e) {
        e.preventDefault();
        setCurrentTag(e.target.value);
    }

    function handleOptionClick(e) {
        setCurrentTag(e);
        addTag(e);
    }

    function handleMouseLeave() {
        setCurrentTag(undefined);
    }

    function handleMouseClick() {
        setCurrentTag('');
    }

    function isValidValue() {
        return currentList !== undefined && currentList.length === 0;
    }

    return (
        <>
            <span className='input-h'>
                <h2 className='column1-h2'>{heading}</h2>
                {isValidValue() ? <>
                    <img src={errorImg}/>
                    <div className='input-alert-triangle'></div>
                    <div className='input-alert'>
                    {alertMessage}
                    </div>
                </> : <></>}
            </span>            
            <div className='input-with-tags'>
                <div className='input-filtercomponent'>
                    <input className="input-installmusic" placeholder={placeholder} value={currentTag} onChange={handleInputChange} onClick={handleMouseClick}/>
                    <button className="submit-tag-input-track" onClick={addTag}>&#10010;</button>
                    <ul ref={select} onMouseLeave={handleMouseLeave}>
                        {filteredOptions?.map(el => <li className="input-option" onClick={e => handleOptionClick(el)}>{el}</li>)}
                    </ul>
                </div>
                <div className="filter-tags">
                    {currentList?.map((tag, index) => (
                        <div className="tag-container2" key={index} id={index.id}  >
                            <span className='tag'>{tag}</span>
                            <button className='tag-close' onClick={() => deleteTag(tag)}>&#215;</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CustomInputWithTags;