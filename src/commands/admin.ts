import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import UserService from '../services/userService';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Make a user an admin')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to make an admin')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('level')
        .setDescription('The admin level')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channelId !== process.env.DISCORD_CHANNEL_ID) {
      await interaction.reply('You\'re not allowed to run that command!');
      return;
    }

    const user = interaction.options.getUser('user');
    if (!user) {
      await interaction.reply('User not found.');
      return;
    }

    const level = interaction.options.getNumber('level');
    if (level === null || level < 0) {
      await interaction.reply('Admin level was not precised, put 0 if you want to remove admin access.');
      return;
    }

    try {
      const existingUser = await UserService.getUserByDiscordId(user.id);
      if (existingUser) {
        existingUser.isAdmin = level > 0;
        existingUser.adminLevel = level;
        await existingUser.save();

        if (existingUser.isAdmin) await interaction.reply(`${user.username} is now an admin with level: ${existingUser.adminLevel}.`);
        else await interaction.reply(`${user.username} isn't an admin anymore.`)
      } else {
        await interaction.reply('User not found.');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error making the user an admin.');
    }
  },
};

