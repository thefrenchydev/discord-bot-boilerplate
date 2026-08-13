import User, { IUser } from '../models/user';
import { UserDTO } from '../dto/userDto';

class UserService {
  public async createUser(userDTO: UserDTO): Promise<IUser> {
    const user = new User(userDTO);
    return user.save();
  }

  public async getAllUsers(): Promise<IUser[] | null> {
    return User.find();
  }

  public async deleteUser(discordId: string): Promise<IUser | null> {
    return await User.findOneAndDelete({ discordId });
  }

  public async getUserByDiscordId(discordId: string): Promise<IUser | null> {
    return User.findOne({ discordId });
  }

  public async getUserByRobloxId(robloxId: string): Promise<IUser | null> {
    return User.findOne({ robloxId });
  }

  public async resetUser(userDTO: UserDTO): Promise<void> {
    const user = await User.findOne({ discordId: userDTO.discordId });
    if (user) {
      user.isAdmin = false;
      user.adminLevel = 0;
      user.username = userDTO.username;
      user.discordId = userDTO.discordId;
      user.robloxId = userDTO.robloxId;
      await user.save();
    }
  }
}

export default new UserService();
