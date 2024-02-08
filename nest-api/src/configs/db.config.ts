import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const getDbConfig = (config: ConfigService): DataSourceOptions => {
  return config.get('database');
};
