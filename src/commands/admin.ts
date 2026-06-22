import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import UserService from '../services/userService';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Make a user an admin')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to make an admin')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    if (!user) {
      await interaction.reply('User not found.');
      return;
    }

    try {
      const existingUser = await UserService.getUserByDiscordId(user.id);
      if (existingUser) {
        existingUser.isAdmin = true;
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

