import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "../entities/user.entity";

export class CreateUserDto extends UserEntity {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
