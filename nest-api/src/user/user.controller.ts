import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user.response.interface';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') body: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(body);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') body: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(body);
    return this.userService.buildUserResponse(user);
  }
}
