import { Module } from '@nestjs/common';

import { HealthCheckModule } from './health-check/health-check.module';
import { WishlistModule } from './wishlist.module';

@Module({
  imports: [HealthCheckModule, WishlistModule],
})
export class RoutesV1Module {}
