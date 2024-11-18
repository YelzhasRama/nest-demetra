import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @Column({
    name: 'email',
    type: 'text',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'text',
  })
  password: string;

  @Column({
    name: 'status',
    type: 'text',
    default: false,
  })
  status: boolean;
}
