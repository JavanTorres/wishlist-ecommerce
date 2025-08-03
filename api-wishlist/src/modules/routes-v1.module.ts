import { Module } from '@nestjs/common';

import { AuthModule } from './auth.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { WishlistModule } from './wishlist.module';

@Module({
  imports: [HealthCheckModule, AuthModule, WishlistModule],
})
export class RoutesV1Module {}
