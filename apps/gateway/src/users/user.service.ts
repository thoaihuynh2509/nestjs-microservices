import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {User, UserDocument} from './user.schema'
import {Model} from 'mongoose'
import {UserContext} from '../auth/auth.types'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async upsertAuthUser({
    clerkUserId,
    email,
    name,
  }: Pick<UserContext, 'clerkUserId' | 'email' | 'name'>) {
    const now = new Date()
    const user = await this.userModel.findOneAndUpdate(
      {clerkUserId},
      {
        $set: {
          clerkUserId,
          email,
          name,
          lastSeenAt: now,
        },
        $setOnInsert: {role: 'user'},
      },
      {upsert: true, new: true, setDefaultsOnInsert: true}
    )
    return user
  }

  async findByClerkUserId(clerkUserId: string) {
    return this.userModel.findOne({clerkUserId})
  }
}
