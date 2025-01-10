import errorImg from '../../Images/error.svg';
import './CustomInput.css';

function CustomInput({   
    value, 
    placeholder, 
    heading, 
    alertMessage='Поле обязательно для заполнения', 
    onChange, 
    validRegex=undefined,
    isTextArea=false,
    isRequired=false,
    type='text'}) {

    function isValidValue() {
        if (!isRequired && (value === '' || value === undefined)) {
            return false;
        }
            
        if (validRegex === undefined) {
            return value !== undefined && value === '';
        }

        return !validRegex.test(value);
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
            {isTextArea ? 
            <textarea className='song-text-area' placeholder={placeholder} value={value} onChange={onChange}/> :
            <input className='inp-column1' placeholder={placeholder} value={value} onChange={onChange} type={type}/>}
        </>
    )
}

export default CustomInput;