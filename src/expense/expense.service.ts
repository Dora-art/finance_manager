import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { BudgetService } from 'src/budget/budget.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
    private budgetService: BudgetService,
  ) {}

  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const expense = new Expense();
    expense.amount = createExpenseDto.amount;
    expense.description = createExpenseDto.description;
    expense.date = createExpenseDto.date;
    expense.budget = Budget[createExpenseDto.budgetId];

    const activeBudget = await this.budgetService.activeBudget(
      userId,
      createExpenseDto.date,
      createExpenseDto.date,
    );

    expense.budget = activeBudget;

    const amountSpent = await this.amountSpentFromBudget(
      createExpenseDto.budgetId,
    );

    const amountLeft = activeBudget.amount - amountSpent;

    if (createExpenseDto.amount > amountLeft) {
      throw new BadRequestException(
        `Expense exceeds the remaining budget amount. Amount left: ${amountLeft}`,
      );
    }

    return await this.expenseRepository.save(expense);
  }

  async getExpensesByBudget(budgetId: string): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { budget: { id: budgetId } } });
  }

  async amountSpentFromBudget(budgetId: string): Promise<any> {
    const expenses = await this.expenseRepository.find({
      where: {
        budget: { id: budgetId },
      },
      relations: ['budget'],
    });
    let totalAmount = 0;
    for (let i = 0; i < expenses.length; i++) {
      totalAmount += expenses[i].amount;
    }
    return `you have spent ${totalAmount} from your budget`;
  }

  async getOneExpense(id: string) {
    const expense = await this.expenseRepository.findOneBy({ id });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async updateExpense(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOneBy({ id });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const updateExpense = this.expenseRepository.merge(
      expense,
      updateExpenseDto,
    );

    return await this.expenseRepository.save(updateExpense);
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: {
        id: expenseId,
      },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.expenseRepository.remove(expense);
  }
}
