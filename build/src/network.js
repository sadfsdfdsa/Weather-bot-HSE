import { userLocationById } from './store.js';
import fetch from 'node-fetch';
const weatherApiURL = 'https://api.open-meteo.com/v1/forecast';
const getFormattedDate = (date = new Date(), nextDay = false) => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    if (nextDay)
        date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};
const buildApiUrlWithParams = (location, days = 1) => {
    const latitude = location.latitude.toFixed(2);
    const longitude = location.longitude.toFixed(2);
    // If days > 0 - skip today and start from tomorrow
    const startDate = getFormattedDate(new Date(), days !== 0);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endDateString = getFormattedDate(endDate);
    return `${weatherApiURL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&start_date=${startDate}&end_date=${endDateString}`;
};
export const fetchWeatherForUser = async (id, days) => {
    const data = userLocationById[id];
    if (!data)
        throw new Error('No user id: ' + id);
    const url = buildApiUrlWithParams(data, days);
    const res = await fetch(url);
    const { hourly: { time, temperature_2m, weathercode },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
     } = (await res.json());
    const forecast = {
        time,
        temperature_2m,
        weathercode,
    };
    console.log('Request from user for', id, days);
    return forecast;
};
//# sourceMappingURL=network.js.map