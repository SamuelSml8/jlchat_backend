import { Role } from '../enums/roles.enum';

export type JwtPayload = {
  sub: string;
  name: string;
  lastName: string;
  email: string;
  role: Role;
  chats: string[];
  groups: string[];
  friends: string[];
};
