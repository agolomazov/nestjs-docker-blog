import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseInterface } from './types/user.response.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AuthGuard } from './guards/user.guard';

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

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user: UserEntity) {
    return this.userService.buildUserResponse(user);
  }
}
