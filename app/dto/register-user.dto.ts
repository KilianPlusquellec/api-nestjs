import { IsEmail, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsNotEmpty({
    message: 'Le mot de passe est obligatoire'
  })
  password: string;

  @IsNotEmpty({
    message: 'La confirmation du mot de passe est obligatoire'
  })
  confirmPassword: string;
}