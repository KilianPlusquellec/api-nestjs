import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      if (['GET','PATCH', 'DELETE'].includes(request.method)) {
        throw new UnauthorizedException('Vous devez être authentifié avec un JWT valide pour effectuer cette action.');
      }
    }
    return user;
  }
}