import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  getRootRoute() {
    return {message: 'Welcome to the API!'};
  }
}