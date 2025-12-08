import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World Mohini! I hope tu as fait un good trip to Italy';
  }
}
