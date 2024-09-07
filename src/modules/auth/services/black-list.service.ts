import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackListDocument } from '../schemas/black-list.schema';
import { Token } from 'src/common/types/token.type';

@Injectable()
export class BlackListService {
  constructor(
    @InjectModel('BlackList')
    private readonly blackListModel: Model<BlackListDocument>,
  ) {}

  async addTokenToBlackList(token: Token): Promise<void> {
    await this.blackListModel.create({ token: token.accessToken });
  }

  async isTokenBlackListed(token: Token): Promise<boolean> {
    const blackListToken = await this.blackListModel.findOne({
      token: token.accessToken,
    });
    return !!blackListToken;
  }
}
