import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.params.userId === req.user.id) {
      return true;
    } else {
      throw new ForbiddenException('User does not have access to this entity');
    }
  }
}

@Injectable()
export class UserNotExistsGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = await this.usersRepository.findOne({ id: req.user.id });

    if (!user) {
      throw new ForbiddenException('User with this id not exists');
    }
    return true;
  }
}

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = await this.usersRepository.findOne({ email: req.body.email });

    if (user) {
      throw new ForbiddenException('User with this email already exists');
    }
    return true;
  }
}
