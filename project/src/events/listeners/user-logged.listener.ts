import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserLoggedEvent } from "../user-events.service";



@Injectable()
export class UserLoggedListener {
  private readonly logger = new Logger(UserLoggedListener.name);

  @OnEvent('user.logged')
  handleUserLoggedEvent(event: UserLoggedEvent): void {
    const { user, timeStamp } = event;

    //real app -> you will mainly do action here
    //send an verify email customers
    this.logger.log(
      `Welcome back, ${user.email}!`,
    );
  }
} 