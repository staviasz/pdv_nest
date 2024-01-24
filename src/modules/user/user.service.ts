import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (await this.findByEmail(createUserDto.email)) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHashed = await bcrypt.hash(createUserDto.password, 8);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Invalid password');
    }

    return { user, token: this.jwt.generateToken(user) };
  }

  async findOne(id: number) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      if (await this.findByEmail(updateUserDto.email, id)) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
    }
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return;
  }

  async findByEmail(email: string, id?: number) {
    return await this.prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });
  }
}
