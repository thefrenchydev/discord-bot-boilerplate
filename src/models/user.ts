import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  discordId: string;
  robloxId: string;
  adminLevel: number;
  isAdmin?: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  discordId: { type: String, required: true, unique: true },
  robloxId: { type: String, required: true, unique: true },
  adminlevel: { type: Number, required: true },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', UserSchema);