export type JwtPayload = {
    sub: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
    chats: string[];
    groups: string[];
    friends: string[];
  };