import TelegramBot from 'node-telegram-bot-api';
import { parseForecast } from './forecast.js';
import { getItalic } from './htmlUtils.js';
import { fetchWeatherForUser } from './network.js';
import { userLocationById } from './store.js';
// replace the value below with the Telegram token you receive from @BotFather
const token = '5640173666:AAG2B9KMAqK7YJxjY1BHlJ1AE2ocfTRlv5M';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const TODAY = '🗓️ Today';
const TOMORROW = '1️⃣ Tomorrow';
const WEEK = '7️⃣ Week';
const TWO_WEEKS = '1️⃣4️⃣ 2 Weeks';
const FORECAST_REPLY_BUTTONS = [TODAY, TOMORROW, WEEK, TWO_WEEKS];
const REMOVE_LOCATION_BTN = '❌ Remove location';
const handleLocation = (msg) => {
    const { chat: { id: chatId }, from: { id: fromId }, location: { latitude, longitude }, } = msg;
    userLocationById[fromId] = {
        latitude,
        longitude,
    };
    const text = '✅ Select period for a forecast:';
    const keyboard = {
        resize_keyboard: true,
        keyboard: [
            FORECAST_REPLY_BUTTONS.map((btnText) => {
                return {
                    text: btnText,
                };
            }),
            [
                {
                    text: REMOVE_LOCATION_BTN,
                },
            ],
        ],
    };
    bot.sendMessage(chatId, text, {
        reply_markup: keyboard,
    });
};
const handleForecastRequest = async (msg) => {
    const send = (forecast) => {
        bot.sendMessage(msg.chat.id, parseForecast(forecast), {
            parse_mode: 'HTML',
        });
    };
    try {
        if (msg.text === TODAY) {
            const forecast = await fetchWeatherForUser(msg.from.id, 0);
            send(forecast);
        }
        else if (msg.text === TOMORROW) {
            const forecast = await fetchWeatherForUser(msg.from.id, 1);
            send(forecast);
        }
        else if (msg.text === WEEK) {
            const forecast = await fetchWeatherForUser(msg.from.id, 7);
            send(forecast);
        }
        else if (msg.text === TWO_WEEKS) {
            const forecast = await fetchWeatherForUser(msg.from.id, 14);
            send(forecast);
        }
    }
    catch (error) {
        console.warn('Error during forecase request handling', error);
        sendFirstMessage(msg);
    }
};
const sendFirstMessage = (msg) => {
    const sorryText = 'We are sorry, but button on PC/MAC does not work, you need to send location manually on MacOS or from your phone.';
    const text = `📍 Send location to me for receiving a forecast!
  ${getItalic(sorryText)}`;
    const keyboard = {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            [
                {
                    text: '📍 Send location',
                    request_location: true,
                },
            ],
        ],
    };
    bot.sendMessage(msg.from.id, text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
    });
};
bot.on('message', (msg) => {
    console.log('New message from', msg.from.id, msg.from.username);
    if (msg.location)
        return handleLocation(msg);
    if (FORECAST_REPLY_BUTTONS.includes(msg.text))
        return handleForecastRequest(msg);
    if (msg.text === REMOVE_LOCATION_BTN) {
        delete userLocationById[msg.from.id];
    }
    sendFirstMessage(msg);
});
console.log('BOT IS LISTENING');
//# sourceMappingURL=main.js.map