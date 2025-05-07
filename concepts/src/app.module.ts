import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HelloModule } from './hello/hello.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import * as joi from 'joi'
import appConfig from './config/app.config'


//  root module -. uses all the submodules

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make the config globally available
      // validationSchema: joi.object({
      //   APP_NAME: joi.string().default('default value'),
      // }),
      load: [appConfig],
    }),
    
    HelloModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
