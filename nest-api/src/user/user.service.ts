import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { SECRET_JWT } from '../configs/jwt.config';
import { UserResponseInterface } from './types/user.response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: body.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: body.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, body);

    return await this.userRepository.save(newUser);
  }

  async login(body: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        bio: true,
        image: true,
      },
      where: {
        email: body.email,
      },
    });

    if (!userByEmail) {
      throw new NotFoundException('User with login or password not found');
    }

    const isPasswordCorrect = await compare(
      body.password,
      userByEmail.password,
    );

    if (!isPasswordCorrect) {
      throw new NotFoundException('User with login or password not found');
    }

    delete userByEmail.password;

    return userByEmail;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.email,
        email: user.email,
      },
      SECRET_JWT,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
