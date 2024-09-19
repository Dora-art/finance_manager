import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User();
      user.email = createUserDto.email.toLocaleLowerCase();

      const salt = await bcrypt.genSalt();

      user.password = await bcrypt.hash(createUserDto.password, salt);

      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getOneUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserId(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
      select: ['password', 'id', 'email'],
    });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.save(user);
  }
  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.remove(user);
  }
}
