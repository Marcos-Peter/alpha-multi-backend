import { User } from "@prisma/client";

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
