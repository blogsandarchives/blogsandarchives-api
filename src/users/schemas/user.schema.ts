import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  fullname: string;

  @Prop()
  username: string;
  @Prop()
  passwordHash: string;

  @Prop()
  creationDate: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
