export function getWordSpelling(number, rootWord) {
    if (number % 10 > 4 || number === 0) {
        return number + ' ' + rootWord + 'ов';
    } else if (number === 1) {
        return number + ' ' + rootWord;
    } else {
        return number + ' ' + rootWord + 'а';
    }
}

export function formatTime(time, onlyTime=true) {
    // Отформатировать время к нужному виду
    if (time !== undefined && time !== null) {
        let newTime = new Date(time);
        const now = new Date();
        if (onlyTime)
            return newTime.toLocaleTimeString().slice(0, 5);
        else {
            const diffDays = Math.floor((now - newTime) / (1000 * 60 * 60 * 24));
    
            if (diffDays < 1) {
                return newTime.toLocaleTimeString().slice(0, 5);
            }
            if (diffDays === 1) {
                return 'Вчера';
            }
            
            const optionsWithoutYear = {
                day: 'numeric',
                month: 'short'
            };
            
            const yearOptions = {
                year: 'numeric'
            };
            
            const showYear = newTime.getFullYear() !== now.getFullYear();
            let result = newTime.toLocaleDateString('ru-RU', optionsWithoutYear);
            if (showYear) {
                result += ' ' + newTime.toLocaleDateString('ru-RU', yearOptions);
            }
            return result;
        }
    }
    else return '';
}

export function shortenText(text, numberOfSymbols) {
    // Сократить сообщение
    if (text?.length > numberOfSymbols)
        return text.slice(0, numberOfSymbols) + '...';
    return text;
}

export const statusType = {
    0: 'На согласовании',
    1: 'На модерации',
    2: 'На доработке',
    3: 'Опубликовано',
    4: 'Отклонено',
    5: 'Отозвано'
};

export const statusColor = {
    0: 'yellow',
    1: 'yellow',
    2: 'yellow',
    3: 'green',
    4: 'red',
    5: 'red'
}