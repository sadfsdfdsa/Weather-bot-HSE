import { getStrong, getUnderline } from './htmlUtils.js';
const DAY_START = 7;
const DAY_END = 22;
const getWeatherByCode = (codeWMO) => {
    if (codeWMO === 0)
        return '☀️ Clear sky';
    if ([1, 2, 3].includes(codeWMO))
        return '⛅ Partly cloudy';
    if ([45, 48].includes(codeWMO))
        return '🌫️ Fog';
    if ([51, 53, 55].includes(codeWMO))
        return '☔ Drizzle';
    if ([56, 57].includes(codeWMO))
        return '🌧️ Freezing drizle';
    if ([61, 63, 65].includes(codeWMO))
        return '🌧️ Rain';
    if ([66, 67].includes(codeWMO))
        return '🌧️ Freezing rain';
    if ([71, 73, 75].includes(codeWMO))
        return '❄️ Snow fall';
    if ([77].includes(codeWMO))
        return '❄️ Snow grains';
    if ([80, 81, 82].includes(codeWMO))
        return '🌧️ Rain showers';
    if ([85, 86].includes(codeWMO))
        return '❄️ Snow showers';
    if ([95].includes(codeWMO))
        return '⛈️ Thunderstorm';
    if ([96, 99].includes(codeWMO))
        return 'Thunderstorm with slight and heavy hail';
    return 'Unreachable';
};
// For 24 hours
const extendedForecast = (forecast) => {
    return shortForecast(forecast);
};
// For 24 hours
const shortForecast = (forecast) => {
    let nightTmp = 0;
    let dayTmp = 0;
    let nightHoursNumber = 0;
    forecast.temperature_2m.forEach((value, index) => {
        if (index <= DAY_START || index >= DAY_END) {
            nightTmp += value;
            nightHoursNumber += 1;
        }
        else {
            dayTmp += value;
        }
    });
    const dayHoursNumber = 24 - nightHoursNumber;
    const avgNightTmp = (nightTmp / nightHoursNumber).toFixed(0);
    const avgDayTmp = (dayTmp / dayHoursNumber).toFixed(0);
    const date = new Date(forecast.time[0]);
    const weatherNight = getWeatherByCode(forecast.weathercode[4]);
    const weatherDay = getWeatherByCode(forecast.weathercode[15]);
    const dateStr = date.getDate() + '.' + date.getMonth();
    return `
  🗓️${getUnderline(dateStr)}:
  🌞 Day:
    Weather: ${getStrong(weatherDay)}.
    Temperature: 🌡️ ${getStrong(avgDayTmp)} C°.

  🌚 Night:
    Weather: ${getStrong(weatherNight)}.
    Temperature: 🌡️ ${getStrong(avgNightTmp)} C°`;
};
const compositeForecast = (forecast) => {
    let totalText = `${getStrong('There is your forecast')}:
  `;
    const chunkSize = 24;
    for (let i = 0; i < forecast.time.length; i += chunkSize) {
        const chunkTime = forecast.time.slice(i, i + chunkSize);
        const chunkTemp = forecast.temperature_2m.slice(i, i + chunkSize);
        const chunkWeather = forecast.weathercode.slice(i, i + chunkSize);
        totalText += shortForecast({
            temperature_2m: chunkTemp,
            weathercode: chunkWeather,
            time: chunkTime,
        });
        totalText += `
    `;
    }
    return totalText;
};
export const parseForecast = (forecast) => {
    if (forecast.time.length <= 24)
        return extendedForecast(forecast);
    return compositeForecast(forecast);
};
//# sourceMappingURL=forecast.js.map