export type Role = 'user' | 'agent';

export interface JwtUser {
  id: string;
  role: Role;
  email: string;
}

