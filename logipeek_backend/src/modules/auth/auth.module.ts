import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { DriverProfile, DriverProfileSchema } from '../../schemas/driver-profile.schema';
import { ShipperProfile, ShipperProfileSchema } from '../../schemas/shipper-profile.schema';
import { VerificationCode, VerificationCodeSchema } from '../../schemas/verification-code.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DriverProfile.name, schema: DriverProfileSchema },
      { name: ShipperProfile.name, schema: ShipperProfileSchema },
      { name: VerificationCode.name, schema: VerificationCodeSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
