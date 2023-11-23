import { Repository } from 'typeorm';
import { UsersModel } from './users.model';

export class UsersRepository extends Repository<UsersModel> {}
