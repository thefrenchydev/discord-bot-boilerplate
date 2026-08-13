export class UserDTO {
  public username: string;
  public discordId: string;
  public robloxId: string;
  public adminLevel: number;
  public isAdmin: boolean;
  
  constructor(username: string, discordId: string, robloxId: string) {
    this.username = username;
    this.discordId = discordId;
    this.robloxId = robloxId;
    this.adminLevel = 0;
    this.isAdmin = this.adminLevel > 0;
  }
}
