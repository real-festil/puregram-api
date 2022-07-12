import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcryptjs';
import {
  AppleAuthDto,
  ForgotPasswordDto,
  RegisterDto,
  ServiceDto,
} from './auth.dto';
import { UserService } from '../users/users.service';
import fetch from 'node-fetch';
import { init, send } from '@emailjs/browser';
init('user_wyoRsMx8pxobKSQKtM8j7');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      // if (!user.isVerified) {
      //   return { error: true, message: 'Email is not verified' };
      // }
      console.log('user', user);

      const isValid = await bcrypt.compare(password, user.password);
      console.log('isValid', isValid);

      if (user && isValid) {
        return this.login(user);
      }
    }
    return { error: true, message: 'Incorrect email or password' };
  }

  async login(user: User) {
    return {
      ...user,
      access_token: this.jwtService.sign({ sub: user.id }),
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return { error: true, message: 'Email already in use' };
    }

    return await this.userService.addUser(username, email, password);
  }

  async serviceAuth(serviceDto: ServiceDto) {
    const { username, email } = serviceDto;

    const user = await this.usersRepository.findOne({ email });

    if (user) {
      return this.login(user);
    }

    const newUser = await this.userService.addUser(
      username,
      email,
      'serviceUserType',
    );
    return await this.login(newUser);
  }

  async getVerificationCode(email: string) {
    const code = Math.floor(1000 + Math.random() * 9000);
    await this.sendVerificationCode(email, code);
    return { code };
  }

  async sendVerificationCode(email: string, code: number) {
    const body = {
      personalizations: [{ to: [{ email: email }], subject: 'SmartReader' }],
      from: { email: 'smartreaderapp1@gmail.com' },
      content: [
        {
          type: 'text/html',
          value: `<div>Your verification code: ${code}</div>`,
        },
      ],
    };

    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log('response', response);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async verifyUser(email: string, userId: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return await this.userService.updateUser(
        userId,
        {
          ...user,
          isVerified: true,
        },
        true,
      );
    }
    return { error: true, message: 'User with this email not found.' };
  }

  async resetPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { userId, userData } = forgotPasswordDto;

    const user = await this.usersRepository.findOne({ email: userData.email });
    if (user) {
      return await this.userService.updateUser(userId, userData);
    }
    return { error: true, message: 'User with this email not found.' };
  }

  async userExists({ email }: { email: string }) {
    const user = await this.usersRepository.findOne({ email });
    console.log('user', user);
    console.log('email', email);
    if (user) {
      return { email, id: user.id };
    }
    return { error: true, message: 'User with this email not found.' };
  }

  async appleAuth({ appleId, email, username }: AppleAuthDto) {
    const user = await this.usersRepository.findOne({ appleId });

    if (user) {
      return this.login(user);
    }

    const newUser = await this.userService.addUser(
      username,
      email,
      'serviceUserType',
      appleId,
    );
    return await this.login(newUser);
  }
}
