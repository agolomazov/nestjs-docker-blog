import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Get()
  async findAll() {
    return ['dragons', 'coffee'];
  }
}
