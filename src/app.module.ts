import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ClientModule } from './modules/client/client.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ClientModule,
    OrderModule,
  ],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
