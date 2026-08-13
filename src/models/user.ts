import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  discordId: string;
  robloxId: string;
  isAdmin?: boolean;
  adminLevel: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  discordId: { type: String, required: true, unique: true },
  robloxId: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  adminlevel: { type: Number, default: 0 },
});

export default mongoose.model<IUser>('User', UserSchema);