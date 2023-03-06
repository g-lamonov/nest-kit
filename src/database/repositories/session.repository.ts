import { InjectRepository } from '@nestjs/typeorm';
import { SessionStatus } from 'src/enums';
import { FindOneOptions, Repository } from 'typeorm';
import { SessionEntity } from '../entity/session.entity';

export class SessionRepository extends Repository<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private _sessionRepository: Repository<SessionEntity>,
  ) {
    super(
      _sessionRepository.target,
      _sessionRepository.manager,
      _sessionRepository.queryRunner,
    );
  }

  async findById(
    id: string,
    options?: FindOneOptions<SessionEntity>,
  ): Promise<SessionEntity> {
    const data = await this.findOne({
      where: {
        id,
      },
      relations: ['user'],
      ...options,
    });

    return data;
  }

  async createSession(userId: string): Promise<SessionEntity> {
    const data = await this.create({
      userId,
      status: SessionStatus.Active,
    });

    return this.save(data);
  }

  async closeSession(sessionId: string): Promise<void> {
    await this.update(
      {
        status: SessionStatus.Finished,
      },
      {
        id: sessionId,
      },
    );
  }
}
