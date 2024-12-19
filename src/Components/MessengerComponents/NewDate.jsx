const Month = (number) => {
    let months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return months[number - 1];
}
let prevMessageDateTime = 0;

const NewDate = ({currentDate}) => {
    // Линия даты
    let formatTime = new Date(currentDate);
    let day = formatTime.getDate();
    let month = formatTime.getMonth();
    let year = formatTime.getFullYear();
    let prev = prevMessageDateTime;
    prevMessageDateTime = formatTime;
    if (typeof prev === "object" && prev.getFullYear() === 1970) {
        return;
    }
    if (prev !== 0 && (prev.getDate() !== day || prev.getMonth() !== month)) {
        return (
            <span className="chat-date">
                <div className="line"></div>
                { prev.getDate() +  ' ' + Month(prev.getMonth() + 1)}
                <div className="line"></div>
            </span>
        )
    } else if (prev !== 0 && prev.getFullYear() !== year) {
        return (
            <span className="chat-date">
                <div className="line"></div>
                { prev.getDate() +  ' ' + Month(prev.getMonth() + 1) +  ' ' + prev.getFullYear()}
                <div className="line"></div>
            </span>
        )
    }
}

export default NewDate;