import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import compileTemplate from 'src/utils/sendEmails/compileHtml';
import sendEmail from 'src/utils/sendEmails/sendEmail';
import {
  ContextClientEmail,
  ContextHtmlEmail,
} from 'src/utils/sendEmails/types/email';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, ProductDto } from './dto/create-order.dto';

interface PrismaProduct {
  id: number;
  description: string | null;
  stockAmount: number;
  value: number;
  image: string | null;
  categoryId: number;
}

interface PrismaOrder {
  id: number;
  observation: string | null;
  totalAmount: number;
  clientId: number;
}

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const client = await this.findClientAndVerifyAddress(
      createOrderDto.clientId,
    );

    const cleanedProducts = this.cleanProducts(createOrderDto.products);

    const products = await this.findProducts(cleanedProducts);

    let response = {};
    await this.prisma.$transaction(async (txtPrisma: PrismaService) => {
      const queries = [
        this.updateStock(cleanedProducts, txtPrisma),
        this.createOrder(createOrderDto, products, cleanedProducts, txtPrisma),
      ];
      const [, order] = await Promise.all(queries);
      await this.createOrderProduct(
        products,
        cleanedProducts,
        (order as PrismaOrder).id,
        txtPrisma,
      );

      response = {
        orderId: (order as PrismaOrder).id,
        clientId: createOrderDto.clientId,
        products: Object.values(cleanedProducts),
      };
    });

    this.oderEmail(
      { ...client },
      response['orderId'],
      products,
      cleanedProducts,
    );

    return response;
  }

  async findAll() {
    return await this.prisma.order.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.order.findUniqueOrThrow({ where: { id } });
  }

  private cleanProducts(products: Array<ProductDto>): Array<ProductDto> {
    const groupedProducts = {};

    products.forEach(product => {
      const productId = product.productId;

      if (!groupedProducts[productId]) {
        groupedProducts[productId] = product;
      } else {
        groupedProducts[productId].quantity += product.quantity;
      }
    });

    return Object.values(groupedProducts);
  }

  private async findProducts(
    cleanedProducts: Array<ProductDto>,
  ): Promise<Array<PrismaProduct>> {
    const queries = [];
    for (const value of cleanedProducts) {
      queries.push(
        this.prisma.product.findUniqueOrThrow({
          where: { id: value.productId },
        }),
      );
    }

    const products = await Promise.all(queries);
    this.ValidateQuantityInStock(products, cleanedProducts);

    return products;
  }

  private ValidateQuantityInStock(
    products: Array<PrismaProduct>,
    cleanedProducts: Array<ProductDto>,
  ) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].stockAmount < cleanedProducts[i].quantity) {
        throw new BadRequestException(
          `The product #${cleanedProducts[i].productId} possui apenas ${products[i].stockAmount} em estoque`,
        );
      }
    }
  }

  private async updateStock(
    cleanedProducts: Array<ProductDto>,
    txtPrisma: PrismaService,
  ) {
    const updates: Array<Prisma.ProductUpdateManyArgs> = cleanedProducts.map(
      update => ({
        where: { id: update.productId },
        data: { stockAmount: { decrement: update.quantity } },
      }),
    );

    await Promise.all(
      updates.map(update =>
        txtPrisma.product.update({
          where: { id: update.where.id as number },
          data: update.data,
        }),
      ),
    );
  }

  private totalAmount(
    products: Array<PrismaProduct>,
    cleanedProducts: Array<ProductDto>,
  ) {
    let totalValue: number = 0;
    for (let i = 0; i < products.length; i++) {
      totalValue += products[i].value * cleanedProducts[i].quantity;
    }

    return totalValue;
  }

  private async createOrder(
    createOrderDto: CreateOrderDto,
    products: Array<PrismaProduct>,
    cleanedProducts: Array<ProductDto>,
    txtPrisma: PrismaService,
  ): Promise<PrismaOrder> {
    return await txtPrisma.order.create({
      data: {
        observation: createOrderDto.observation,
        totalAmount: this.totalAmount(products, cleanedProducts),
        clientId: createOrderDto.clientId,
      },
    });
  }

  private async createOrderProduct(
    products: Array<PrismaProduct>,
    cleanedProducts: Array<ProductDto>,
    orderId: number,
    txtPrisma: PrismaService,
  ) {
    const orderProductData: Array<Prisma.OrderProductCreateManyInput> =
      cleanedProducts.map(product => ({
        productAmount: product.quantity,
        productId: product.productId,
        orderId: orderId,
        productValue: products.find(
          productValue => product.productId === productValue.id,
        ).value,
      }));

    return await txtPrisma.orderProduct.createMany({
      data: orderProductData,
    });
  }

  private async oderEmail(
    client: ContextClientEmail,
    orderId: number,
    products: Array<PrismaProduct>,
    cleanedProducts: Array<ProductDto>,
  ) {
    const productsContext = products.map(item => {
      const noImage = 'https://i.ibb.co/nQsWkjb/produto-sem-imagem.webp';

      return {
        imageUrl: item.image || noImage,
        name: item.description,
        quantity: cleanedProducts.find(product => product.productId === item.id)
          .quantity,
        price: Number((item.value / 100).toFixed(2)),
      };
    });

    const context: ContextHtmlEmail = {
      ...client,
      orderId,
      products: productsContext,
      totalValue: Number(
        (this.totalAmount(products, cleanedProducts) / 100).toFixed(2),
      ),
    };

    const html = await compileTemplate('./src/templates/email.html', context);
    sendEmail({ ...client }, html);
  }

  private async findClientAndVerifyAddress(clientId: number) {
    const client = await this.prisma.client.findUniqueOrThrow({
      where: { id: clientId },
    });

    for (const key in client) {
      if (!client[key]) {
        throw new BadRequestException(
          'To place an order is necessary an address',
        );
      }
    }

    return client;
  }
}
