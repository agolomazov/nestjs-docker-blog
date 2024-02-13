import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BackendValidationPipe } from 'src/shared/pipes/backend.validation.pipe';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponseInterface } from './types/user.response.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') body: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(body);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
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

  @Put('user')
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(userId, updateUserDto);
    return this.userService.buildUserResponse(user);
  }
}
