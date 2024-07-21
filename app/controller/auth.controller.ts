import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersService } from '../service/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Identifiants invalides.');
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Identifiants invalides.');
    }

    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);

    response.setHeader('Authorization', `Bearer ${token}`);
    return response.json({ message: 'Connexion réussie' });
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    if (!registerUserDto.password) {
      throw new BadRequestException('Le mot de passe est requis.');
    }

    if (registerUserDto.password !== registerUserDto.confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }
    
    if (!registerUserDto.confirmPassword) {
      throw new BadRequestException('La confirmation du mot de passe est requise');
    }

    if (!registerUserDto.name) {
      throw new BadRequestException('Le nom est requis.');
    }

    if (!registerUserDto.age) {
      throw new BadRequestException('L’âge est requis.');
    }

    if(!registerUserDto.email) {
      throw new BadRequestException('L’email est requis.');
    }
    
    const existingUser = await this.usersService.findOneByEmail(registerUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);
    const newUser = await this.usersService.create({
      email: registerUserDto.email,
      password: hashedPassword,
      name: registerUserDto.name,
      age: registerUserDto.age,
      confirmPassword: hashedPassword,
    });

    return {
      message: 'Utilisateur enregistré avec succès',
      user: newUser,
    };
  }
}