import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import UserService from '../services/userService';
import { UserDTO } from '../dto/userDto';

export default {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers a new user!')
    .addStringOption(option =>
      option.setName('robloxId')
        .setDescription('Your roblox id')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const robloxId = interaction.options.getString('robloxId');
    if (!robloxId) {
      await interaction.reply('No roblox id was given.');
      return;
    }

    const userDTO = new UserDTO(interaction.user.username, interaction.user.id, robloxId);

    if ((await UserService.getUserByDiscordId(interaction.user.id)) != null) {
      await interaction.reply('User already exists.');
      return;
    }

    if ((await UserService.getUserByRobloxId(robloxId)) != null) {
      await interaction.reply('A user already registered with that roblox id.');
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

