import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import User from '../models/user';
import UserService from '../services/userService';
import { UserDTO } from '../dto/userDto';

export default {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Replies with Hello!'),
  async execute(interaction: ChatInputCommandInteraction) {

    const userDTO = new UserDTO(interaction.user.username, interaction.user.id);

    if ((await UserService.getUserByDiscordId(interaction.user.id)) != null) {
      await interaction.reply('User already exists.');
      return;
    }

    try {
      await UserService.createUser(userDTO);
      await interaction.reply(`Hello, ${interaction.user.username}! Your data has been saved.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error saving your data.');
    }
  },
};

