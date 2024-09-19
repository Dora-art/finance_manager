import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Body() createBudgetDto: CreateBudgetDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.budgetService.createBudget(createBudgetDto, userId);
  }

  @Get('current')
  async getCurrentBudget(@Req() req: Request) {
    const userId = req['user'].id;
    return await this.budgetService.getCurrentBudget(userId);
  }

  @Patch(':id')
  async updateBudget(
    @Param('id') budgetId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Req() req: Request,
  ): Promise<Budget> {
    const userId = req['user'].id;
    return await this.budgetService.updateBudget(
      budgetId,
      updateBudgetDto,
      userId,
    );
  }

  @Get()
  async getUserBudgets(@Req() req: Request) {
    const userId = req['user'].id;
    return await this.budgetService.getUserBudgets(userId);
  }

  @Delete(':id')
  async removeBudget(@Param('id') budgetId: string) {
    return await this.budgetService.removeBudget(budgetId);
  }
}
