import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../user-events.service';

//event listerners -> respond to the events emitted by eventemitter

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent): void {
    const { user, timeStamp } = event;

    //real app -> you will mainly do action here
    //send an verify email customers
    this.logger.log(
      `Welcome, ${user.email}! Your Account created at ${timeStamp.toISOString()}`,
    );
  }
}
