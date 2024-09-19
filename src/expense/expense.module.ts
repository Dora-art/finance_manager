import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { BudgetService } from 'src/budget/budget.service';
import { Budget } from 'src/budget/entities/budget.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Budget, User])],
  exports: [ExpenseService],
  controllers: [ExpenseController],
  providers: [ExpenseService, BudgetService, UserService],
})
export class ExpenseModule {}
