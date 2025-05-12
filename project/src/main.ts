import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap () {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  // validating incomming request bodies automatically
  // we can use these validations individually in controllers as well
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
      disableErrorMessages: false, // disable error messages in production
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor())
  
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
