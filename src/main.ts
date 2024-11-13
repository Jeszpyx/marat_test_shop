import { Bot } from "grammy";
import { SETTINGS } from "./settings";
import { log } from "console";

const bot = new Bot(SETTINGS.TG_BOT_TOKEN);

bot.command("start", (ctx) => {
    log(ctx.message?.from)
});

bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();