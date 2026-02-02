import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { DrizzleModule } from './db/drizzle.module';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

@Module({
  imports: [
    DrizzleModule.forRoot({
      connectionString,
    }),
    AuthModule,
    BooksModule,
    UserModule,
    CategoryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
