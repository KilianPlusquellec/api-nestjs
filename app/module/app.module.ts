import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'app/controller/user.controller';
import { UsersService } from 'app/service/user.service';
import { AppController } from '../controller/app.controller';
import { User } from '../entities/user.entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: '',
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule, // Importe le module d'authentification
  ],
  controllers: [AppController, UserController],
  providers: [UsersService],
})
export class AppModule {}