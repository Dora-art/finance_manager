import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import {
  FindOneOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateExpenseDto } from 'src/expense/dto/create-expense.dto';
import { ExpenseModule } from 'src/expense/expense.module';
import { ExpenseService } from 'src/expense/expense.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget) private budgetRepository: Repository<Budget>,

    private readonly userService: UserService,
  ) {}

  async activeBudget(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Budget> {
    const activeBudget = await this.budgetRepository.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(startDate),
        endDate: MoreThanOrEqual(endDate),
      },
    });

    if (!activeBudget) {
      throw new NotFoundException('No active budget found for this user.');
    }
    return activeBudget;
  }

  private async checkForOverlappingBudget(
    userId: string,
    startDate: Date,
    endDate: Date,
    budgetId?: string,
  ): Promise<void> {
    const IfOverlap: FindOneOptions<Budget> = {
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
        ...(budgetId && { id: Not(budgetId) }),
      },
    };

    const existingBudget = await this.budgetRepository.findOne(IfOverlap);

    if (existingBudget) {
      throw new BadRequestException(
        'Sorry, you already have a budget for this period',
      );
    }
  }

  async createBudget(
    createBudgetDto: CreateBudgetDto,
    userId: string,
  ): Promise<Budget> {
    if (createBudgetDto.endDate < createBudgetDto.startDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    await this.checkForOverlappingBudget(
      userId,
      createBudgetDto.startDate,
      createBudgetDto.endDate,
    );
    const user = await this.userService.getUserId(userId);

    const budget = new Budget();
    budget.amount = createBudgetDto.totalAmount;
    budget.description = createBudgetDto.description;
    budget.startDate = createBudgetDto.startDate;
    budget.endDate = createBudgetDto.endDate;
    budget.user = user;

    const saved = await this.budgetRepository.save(budget);
    return saved;
  }

  async getCurrentBudget(userId: string): Promise<Budget | null> {
    const currentDate = new Date();

    const budget = await this.budgetRepository.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
    if (!budget) {
      throw new NotFoundException(
        'There is no active budget for the current date',
      );
    }
    return budget;
  }

  async updateBudget(
    budgetId: string,
    updateBudgetDto: UpdateBudgetDto,
    userId: string,
  ): Promise<Budget> {
    const budget = await this.budgetRepository.findOneBy({ id: budgetId });
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found`);
    }

    if (updateBudgetDto.startDate && updateBudgetDto.endDate) {
      if (updateBudgetDto.endDate < updateBudgetDto.startDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      await this.checkForOverlappingBudget(
        userId,
        updateBudgetDto.startDate,
        updateBudgetDto.endDate,
      );
    }

    const updatedBudget = this.budgetRepository.merge(budget, updateBudgetDto);

    return await this.budgetRepository.save(updatedBudget);
  }

  async getUserBudgets(userId: string): Promise<Budget[]> {
    return this.budgetRepository.find({ where: { user: { id: userId } } });
  }

  async removeBudget(budgetId: string): Promise<void> {
    const budget = await this.budgetRepository.find({
      where: { id: budgetId },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    await this.budgetRepository.remove(budget);
  }
}

// {

//   "totalAmount": 500000,
//   "description": "Monthly Needs",
//   "startDate": "2024-04-26",
//   "endDate": "2024-09-29",
//   "userId": "8789e608-c2fc-4989-a7ff-cca6ecf724e4"
// }
