import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SuperAdminSyncService } from './super-admin-sync.service';

@Injectable()
export class StartupService implements OnModuleInit {
  private readonly logger = new Logger(StartupService.name);

  constructor(
    private readonly superAdminSyncService: SuperAdminSyncService,
  ) {}

  async onModuleInit() {
    this.logger.log('🚀 Application startup - Running initial setup...');
    
    try {
      // Sync super admin on startup
      await this.superAdminSyncService.syncSuperAdminManual();
      this.logger.log('✅ Super admin sync completed');
    } catch (error) {
      this.logger.error('❌ Startup setup failed:', error);
    }
  }
}