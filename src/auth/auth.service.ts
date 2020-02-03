import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username } = authCredentialsDto;

    const isExists = await this.usersService.isUsernameExists(username);
    if (isExists) {
      throw new BadRequestException('Username already exists');
    }

    await this.usersService.createAndSave(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersService.findOneByUsername(username);

    if (user && await user.validatePassword(password)) {
      return user.username;
    }

    return null;
  }
}
