import { Context, Schema } from 'koishi'

export const name = 'number-linker'

export interface Config {
  enabledGuilds: Array<string>,
  frontLink: string,
  backLink: string,
  minNumber: number,
  maxNumber: number,
}

export const Config: Schema<Config> = Schema.object({
  enabledGuilds: Schema.array(String).role('table').description('启用的群组').required(),
  frontLink: Schema.string().default("https://forum.itzdrli.cc/d/").description("链接的前半部分(数字前的内容)"),
  backLink: Schema.string().default("/").description("链接的后半部分"),
  minNumber: Schema.number().default(100).description("最小数字"),
  maxNumber: Schema.number().default(9999).description("最大数字"),
})

function isNumericAndLessThanFourDigits(input: string): boolean { // Thanks ChatGPT
  const regex = /^\d{1,4}(\/\d{1,4})?$/;
  return regex.test(input);
}

export function apply(ctx: Context, config: Config) {
  ctx.on('message-created', (session) => {
    if (!isNumericAndLessThanFourDigits(session.stripped.content.trim())) return
    if (!config.enabledGuilds.includes(session.guildId)) return
    const numericValue = Number(session.stripped.content.trim());
    console.log(numericValue)
    if (numericValue < config.minNumber || numericValue > config.maxNumber) return;
    const response = config.frontLink + session.stripped.content.trim() + config.backLink
    session.send(response)
    return
  })
}
