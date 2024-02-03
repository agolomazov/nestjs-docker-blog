import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  async findAll(): Promise<string[]> {
    return ['dragons', 'coffee', 'banana'];
  }
}
