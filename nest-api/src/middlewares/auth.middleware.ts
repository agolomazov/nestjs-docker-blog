import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ExpressRequestInterface } from 'src/types/express.request.interface';
import { verify } from 'jsonwebtoken';
import { SECRET_JWT } from 'src/configs/jwt.config';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, SECRET_JWT) as JwtPayload;
      const user = await this.userService.findById(decode.id);

      req.user = user;

      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
