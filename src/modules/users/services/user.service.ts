import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { createHash } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';
import { isNull, pick } from 'lodash';
import { PaginationDto } from '../../../dtos/pagination.dto';

@Injectable()
export class UserService {
  private readonly jwtPrivateKey =
    this.configService.get<string>('JWT_PRIVATE_KEY');

  private readonly authColumns = [
    'id',
    'name',
    'email',
    'isAdmin',
    'createdAt',
    'updatedAt',
  ];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private hash(input: string): string {
    return createHash('sha512').update(input).digest('hex');
  }

  private signToken(payload: User) {
    return sign(
      {
        id: payload.id,
      },
      this.jwtPrivateKey,
      {
        expiresIn: '2h',
      },
    );
  }

  verifyToken(payload: string, isAdmin?: boolean) {
    const decoded = verify(payload, this.jwtPrivateKey) as unknown as {
      id: string;
    };

    if (!decoded || !decoded.id) return null;

    return this.userRepository.findOneBy({
      id: decoded.id,
      isBanned: false,
      ...(!isNull(isAdmin) && { isAdmin }),
    });
  }

  async createUser(user: RegisterUserDto, isAdmin = false) {
    const newUser = await this.userRepository
      .save({
        ...user,
        ...(isAdmin && { isAdmin: true }),
        password: this.hash(user.password),
      })
      .catch((e: QueryFailedError) => {
        console.log(e.message);
        // TODO make conform with other error format
        throw new BadRequestException({
          email: 'Email already exists',
        });
      });

    return {
      user: newUser,
      token: this.signToken(newUser),
    };
  }

  async loginUser(loginRequest: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginRequest.email,
      },
      select: ['password', ...(this.authColumns as Array<keyof User>)],
    });

    if (!user) {
      throw new BadRequestException({
        email: 'Incorrect email',
      });
    }

    if (this.hash(loginRequest.password) !== user.password) {
      throw new BadRequestException({
        password: 'Incorrect password',
      });
    }

    const token = this.signToken(user);

    return {
      user: pick(user, this.authColumns),
      token,
    };
  }

  async viewUsers(pagination: PaginationDto) {
    const { page, size, search } = pagination;
    const [users, count] = await this.userRepository.findAndCount({
      where: {
        ...(search && {
          name: ILike(`%${search}%`),
        }),
        isAdmin: false,
      },

      take: size,
      skip: page * size,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      total: count,
      data: users,
    };
  }

  async banUser(user: string) {
    const { affected } = await this.userRepository.update(
      {
        id: user,
        isAdmin: false,
        isBanned: false,
      },
      {
        isBannedAt: new Date(),
        isBanned: true,
      },
    );

    return { banned: !!affected };
  }

  async unBanUser(user: string) {
    const { affected } = await this.userRepository.update(
      {
        id: user,
        isAdmin: false,
        isBanned: true,
      },
      {
        isBannedAt: null,
        isBanned: false,
      },
    );

    return { unbanned: !!affected };
  }
}
