import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
  console.log(`🚀 http://localhost:${PORT}/docs`);
}
bootstrap();
