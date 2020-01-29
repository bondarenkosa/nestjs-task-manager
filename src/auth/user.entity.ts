import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcryptjs.hash(password, this.salt);
    return hash === this.password;
  }
}
