import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileid: string;

  @Column()
  uploader: string;

  @Column()
  uploaderid: string;

  @Column()
  upvote: number;

  @Column()
  downvote: number;

  @Column()
  votescore: number;

  @Column()
  landscape: boolean;
}
