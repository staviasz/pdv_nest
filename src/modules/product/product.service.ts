import { BadRequestException, Injectable } from '@nestjs/common';
import deleteFile from 'src/utils/bucketIntegration/delete';
import upload from 'src/utils/bucketIntegration/upload';
import slug from 'src/utils/formats/slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface PrismaProduct {
  id: number;
  description: string;
  stockAmount: number;
  value: number;
  image: string;
  categoryId: number;
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    image?: Express.Multer.File,
  ) {
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

    if (image) {
      createProductDto.image = await this.uploadImage(image);
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    const product = await this.findProductAndValidCategory(
      updateProductDto.categoryId,
      undefined,
      id,
    );

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (image) {
      updateProductDto.image = await this.uploadImage(image);
    }

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const queriesFindProducts = [
      this.prisma.product.findUniqueOrThrow({
        where: {
          id,
        },
      }),
      this.prisma.orderProduct.findFirst({
        where: {
          productId: id,
        },
      }),
    ];

    const [product, productInOrder] = await Promise.all(queriesFindProducts);

    if (productInOrder) {
      throw new BadRequestException('Product cannot be deleted, it has orders');
    }

    const queriesForDelete = [
      this.prisma.product.delete({
        where: {
          id,
        },
      }),
      deleteFile((product as PrismaProduct).image),
    ];

    return await Promise.all(queriesForDelete);
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

  private async uploadImage(image: Express.Multer.File) {
    image.originalname = slug(image.originalname);

    return await upload(image);
  }
}
