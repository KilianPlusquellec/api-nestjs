import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'app/entities/user.entity';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../service/user.service';
import { JwtStrategy } from 'app/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'votreCléSecrète',
      signOptions: { expiresIn: '5min' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class AuthModule {}