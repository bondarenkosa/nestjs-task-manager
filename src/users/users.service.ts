import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async isUsernameExists(username: string): Promise<boolean> {
    return (await this.userRepository.count({ username })) > 0;
  }

  async createAndSave(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const newUser = this.userRepository.create(authCredentialsDto);
    await newUser.save();
  }

  findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }
}
