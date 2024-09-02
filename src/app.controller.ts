import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API health check' })
  @ApiOkResponse({
    type: String,
    example: 'API is healthy!',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
