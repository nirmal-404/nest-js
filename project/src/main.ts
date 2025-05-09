import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  // validating incomming request bodies automatically
  // we can use these validations individually in controllers as well
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // strips properties that do not have decorators
      forbidNonWhitelisted: true,
      transform: true,  // automatically transform payloads to be objects typed according to their DTO classes
      disableErrorMessages: false,  // disable error messages in production
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
