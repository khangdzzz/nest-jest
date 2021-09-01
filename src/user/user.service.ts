import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { IUser } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async save(user: IUser) {
    const userValidate = await this.userRepository.findOne({
      username: user.username,
    });

    if (userValidate)
      throw new InternalServerErrorException({
        message: 'Este nome de usuário já está em uso',
      });

    await this.userRepository.insert(user);

    return await this.userRepository.findOne({ username: user.username });
  }
}
