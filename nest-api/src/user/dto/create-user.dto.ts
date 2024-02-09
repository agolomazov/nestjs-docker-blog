import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Поле username не может быть пустым',
  })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({
    message: 'Поле password не может быть пустым',
  })
  readonly password: string;
}
