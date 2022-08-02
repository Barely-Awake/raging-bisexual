import { Message } from 'discord.js';
import { CommandCategory } from '../../../types/discord.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';

export default class Unban {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'unban',
    category: CommandCategory = 'moderation',
    aliases: string[] | null = null,
    description = 'Unbans the target user',
    usage = '<user> [reason]',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, args: string[]) {
    if (!message.guild)
      return error('This command must be run in a guild', message);

    if (!message.member?.permissions.has('BanMembers'))
      return error('You can\'t unban users', message);

    if (!message.guild.members.me?.permissions.has('BanMembers'))
      return error('I don\'t have permission to ban members ' +
        '(*I\'m a moderation bot, it\'s recommended to give me admin*)', message);

    const user = await resolveUser(message, args[0]);
    args.shift();
    const reason = args.join(' ');

    if (user === null)
      return error('I couldn\'t find that user, make sure you\'re providing a mention or id', message);

    await message.guild.bans.remove(user, reason || 'None');

    return message.channel.send(
      `Successfully unbanned ${user.toString()} (\`${user.tag}\`) for ${reason || 'None'}`,
    );
  }
}
