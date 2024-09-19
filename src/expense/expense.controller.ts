import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('expense')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: Request,
  ): Promise<Expense> {
    const userId = req['user'].id;
    return this.expenseService.createExpense(createExpenseDto, userId);
  }

  @Get()
  @ApiOperation({})
  async getExpensesByBudget(budgetId: string): Promise<Expense[]> {
    return await this.expenseService.getExpensesByBudget(budgetId);
  }

  @Get('amount')
  async amountSpentFromBudget(budgetId: string): Promise<number> {
    return await this.expenseService.amountSpentFromBudget(budgetId);
  }

  @Get(':id')
  async getOneExpense(@Param('id') id: string): Promise<Expense> {
    return await this.expenseService.getOneExpense(id);
  }

  @Patch(':id')
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return await this.expenseService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  async deleteExpense(@Param('id') id: string) {
    return await this.expenseService.deleteExpense(id);
  }
}
