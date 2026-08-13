export class UserDTO {
    public username: string;
    public discordId: string;
    public robloxId: string;
  
    constructor(username: string, discordId: string, robloxId: string) {
      this.username = username;
      this.discordId = discordId;
      this.robloxId = robloxId;
    }
  }
  