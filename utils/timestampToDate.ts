
import date from 'date-and-time';

const timestampToDate = (timestamp: string) => {
    return date.format(new Date(parseInt(timestamp) * 1000), 'YYYY/MM/DD HH:mm:ss');
}

export default timestampToDate;