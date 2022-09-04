import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  create(data: CreateUserDto) {
    return this.repository.create(data);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  update(id: string, data: UpdateUserDto) {
    return this.repository.update(id, data);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}
