import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}
  async create(createClientDto: CreateClientDto) {
    await Promise.all([
      this.findByCpf(createClientDto.cpf),
      this.findByEmail(createClientDto.email),
    ]);

    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  findAll() {
    return this.prisma.client.findMany();
  }

  findOne(id: number) {
    return this.prisma.client.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    if (updateClientDto.email) {
      await this.findByEmail(updateClientDto.email, id);
    }
    if (updateClientDto.cpf) {
      await this.findByCpf(updateClientDto.cpf, id);
    }

    return await this.prisma.client.update({
      where: {
        id,
      },
      data: updateClientDto,
    });
  }

  remove(id: number) {
    this.prisma.client.delete({
      where: {
        id,
      },
    });
    return;
  }

  private async findByEmail(email: string, id?: number) {
    if (
      await this.prisma.client.findFirst({
        where: {
          email,
          id: { not: id },
        },
      })
    ) {
      throw new BadRequestException('Email already exists');
    }
  }
  private async findByCpf(cpf: string, id?: number) {
    if (
      await this.prisma.client.findFirst({
        where: {
          cpf,
          id: { not: id },
        },
      })
    ) {
      throw new BadRequestException('Cpf already exists');
    }
  }
}
