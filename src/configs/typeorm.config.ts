import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Submissions } from 'src/entities/Submissions';
import { Players } from 'src/entities/Players';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DB_URL'),
      entities: [Submissions, Players],
      synchronize: true,
      logging: true,
    };
  }
}
