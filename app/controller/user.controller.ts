import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UsersService } from '../service/user.service';
import { JwtAuthGuard } from '../strategy/jwt-auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUserRoute() {
    return this.usersService.findAll();
  }


  @Get('/:name')
  @UseGuards(JwtAuthGuard)
  async getUserByName(@Param('name') name: string) {
    const user = await this.usersService.findByName(name);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('/:name')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('name') name: string, @Body() updateUserDto: any) {
    const { password, confirmPassword } = updateUserDto;

    // Supprimez le mot de passe et confirmPassword du DTO pour éviter de les passer directement à la mise à jour
    delete updateUserDto.password;
    delete updateUserDto.confirmPassword;

    // Vérifiez si les mots de passe sont fournis et correspondent
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      // Hachez le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);
      updateUserDto.password = hashedPassword; // Ajoutez le mot de passe haché au DTO pour la mise à jour
    }

    const updatedUser = await this.usersService.updateUserByName(name, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
  
  @Delete('/:name')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('name') name: string) {
    const isDeleted = await this.usersService.deleteUserByName(name);
    if (!isDeleted) {
      throw new NotFoundException('User not found');
    }
    return { message: `User ${name} deleted successfully` };
  }
}