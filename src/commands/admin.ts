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
    const user = interaction.options.getUser('user');
    if (!user) {
      await interaction.reply('User not found.');
      return;
    }

    const level = interaction.options.getNumber('level');
    if (!level) {
      await interaction.reply('Admin level was not precised, put 0 if you want to remove admin access.');
      return;
    }

    try {
      const existingUser = await UserService.getUserByDiscordId(user.id);
      if (existingUser) {
        existingUser.isAdmin = level > 0;
        existingUser.adminLevel = level;
        await existingUser.save();
        await interaction.reply(`${user.username} is now an admin.`);
      } else {
        await interaction.reply('User not found.');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error making the user an admin.');
    }
  },
};

