import TelegramBot from 'node-telegram-bot-api';

export const userLocationById: Record<
  TelegramBot.Chat['id'],
  TelegramBot.Location
> = {};
