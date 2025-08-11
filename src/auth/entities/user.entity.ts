import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  profileImage: string | null;

  @Column({ default: 'student' })
  role: string;
  declare id: any;
  tokens: any;
  loginLogs: any;
}
