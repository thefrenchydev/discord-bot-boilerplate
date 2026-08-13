import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import UserService from '../services/userService';

export default {
  data: new SlashCommandBuilder()
    .setName('unregister')
    .setDescription('Deletes a user!'),
  async execute(interaction: ChatInputCommandInteraction) {
    if ((await UserService.getUserByDiscordId(interaction.user.id)) == null) {
      await interaction.reply('User isn\'t registerd.');
      return;
    }

    try {
      await UserService.deleteUser(interaction.user.id);

      await interaction.reply(`Goodbye, ${interaction.user.username}! Your data has been deleted.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error deleting your data.');
    }
  },
};

