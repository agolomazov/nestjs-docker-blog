import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUser(body: CreateUserDto) {
    return body;
  }
}
