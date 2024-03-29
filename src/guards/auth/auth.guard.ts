import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: AuthService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const { id } = this.jwt.verifyToken(token);
      request.user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
