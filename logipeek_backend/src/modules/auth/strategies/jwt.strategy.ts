import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    const jwtSecret = configService.get('JWT_SECRET') || 'fallback_jwt_secret_for_development';
    
    if (!configService.get('JWT_SECRET')) {
      console.warn('⚠️  JWT_SECRET not found, using fallback secret');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
