import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pattern } from './patterns.model';
import { CreatePatternDto } from './dto/create-pattern.dto';

@Injectable()
export class PatternsService {
  constructor(
    @InjectModel(Pattern)
    private patternModel: typeof Pattern,
  ) {}

  async getAllPatterns(): Promise<Pattern[]> {
    return this.patternModel.findAll();
  }

  async createPattern(createPatternDto: CreatePatternDto): Promise<Pattern[]> {
    const pattern = new Pattern();
    pattern.name = createPatternDto.name;
    pattern.headers = createPatternDto.headers;
    await pattern.save();
    return this.patternModel.findAll();
  }

  async deletePattern(id: number) {
    console.log('ID', id);
    const pattern = await this.patternModel.findOne({ where: { id } });

    return pattern.destroy();
  }
}
