import User, { IUser } from '../models/user';
import { UserDTO } from '../dto/userDto';

class UserService {
  public async createUser(userDTO: UserDTO): Promise<IUser> {
    const user = new User(userDTO);
    return user.save();
  }

  public async getUserByDiscordId(discordId: string): Promise<IUser | null> {
    return User.findOne({ discordId });
  }

  public async resetUser(userDTO: UserDTO): Promise<void> {
    const user = await User.findOne({ discordId: userDTO.discordId });
    if (user) {
      user.isAdmin = false;
      user.username = userDTO.username;
      user.discordId = userDTO.discordId;
      await user.save();
    }
  }
}

export default new UserService();
