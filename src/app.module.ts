import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, CategoryModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
