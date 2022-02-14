import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConnectionModule} from "./Connection/Connection.Module";
import {PasswordModule} from "./Password/Password.Module";
import {AttributeModule} from "./Attributes/Attribute.Module";

@Module({
  imports: [
    ConnectionModule,
    PasswordModule,
    AttributeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
