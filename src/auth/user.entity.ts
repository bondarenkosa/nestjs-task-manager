import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Task } from '../tasks/task.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @IsNotEmpty()
  @Column()
  salt: string;

  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[];

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, this.salt);
  }

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcryptjs.hash(password, this.salt);
    return hash === this.password;
  }
}
