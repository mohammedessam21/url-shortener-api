import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class UrlShortener {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originalUrl: string;

    @Column({ unique: true })
    shortCode: string;

    @Column({ default: 0 })
    accessCount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}
