import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    if (createProductDto.stockAmount <= 0) {
      throw new BadRequestException('Stock amount must be greater than 0');
    }

    const product = await this.findProductAndValidCategory(
      createProductDto.categoryId,
      createProductDto.description,
    );

    if (product) {
      throw new BadRequestException('Product already exists');
    }

    return await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findProductAndValidCategory(
      updateProductDto.categoryId,
      undefined,
      id,
    );

    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  private async findProductAndValidCategory(
    categoryId: number,
    description?: string,
    productId?: number,
  ) {
    const queries = [
      this.prisma.product.findFirst({
        where: {
          OR: [{ description }, { id: productId }],
        },
      }),
      this.prisma.category.findUniqueOrThrow({
        where: {
          id: categoryId,
        },
      }),
    ];

    const [product] = await Promise.all(queries);
    return product;
  }
}
