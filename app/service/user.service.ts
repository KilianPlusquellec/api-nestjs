import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age: number;
}

@Injectable()
export class UsersService {

  private readonly users = [];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto);
    return this.usersRepository.save(user);
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'age'] // Spécifie ici tous les champs que on souhaitez retourner
    });
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateUserByName(name: string, updateUserDto: any): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { name } });
    if (!user) {
      return null;
    }
    
    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);
    return user;
  }
  
  async deleteUserByName(name: string): Promise<boolean> {
    const deleteResult = await this.usersRepository.delete({ name });
    return deleteResult.affected > 0;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
