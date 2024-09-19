import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Budget } from 'src/budget/entities/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense, Budget])],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
  providers: [UserService],
})
export class UserModule {}
