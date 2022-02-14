import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// This 3 lines seem to be useless, but it somehow is required to connect to the pool.
import Amplify, { Auth, API } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
