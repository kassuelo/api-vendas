import { EntityRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
class UserTokensRepository extends Repository<UserToken> {
  public async findById(id: string): Promise<UserToken | undefined> {
    const user = await this.findOne({ where: { id } });
    return user;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.findOne({ where: { token } });
    return userToken;
  }

  public async generate(userId: string): Promise<UserToken | undefined> {
    const userToken = await this.create({
      user_id: userId,
    });

    await this.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
