import helmet from 'helmet';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config/config';
import swaggerConfig from './config/swagger.config';
import { AppExceptionsFilter } from './filters/exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AppValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.server.route_prefix);

  const adapter = app.get(HttpAdapterHost);
  const exceptionFilter = new AppExceptionsFilter(adapter);

  app.useGlobalFilters(exceptionFilter);

  const validatorPipe = new AppValidationPipe();
  app.useGlobalPipes(validatorPipe);

  const responseInterceptor = new ResponseInterceptor();
  app.useGlobalInterceptors(responseInterceptor);

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup(
    `${config.server.route_prefix}${config.swagger.prefix}`,
    app,
    document,
  );

  app.enableCors(config.server.cors);
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
