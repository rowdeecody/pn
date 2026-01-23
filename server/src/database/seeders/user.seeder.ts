import User, { UserCreationAttributes } from '../../models/User';
import Seeder from '../../core/seeder';
import bcrypt from 'bcrypt';
import users from '../backup/users.json';

export default class UserSeeder {
    public async up(): Promise<void> {
        const usersToInsert: Partial<UserCreationAttributes>[] = [];

        for (const u of users as any[]) {
            if (!u.email && !u.username) continue;

            const passwordHash: string | null = u.password ? await bcrypt.hash(u.password, 10) : null;

            const userObj: Partial<UserCreationAttributes> = {
                name: u.name || u.fullName || 'User',
                username: u.username || (u.email ? u.email.split('@')[0] : `user_${u._id}`),
                email: u.email || `${u.username || `user_${u._id}`}@example.com`,
                role: u.role || 'user',
            };

            if (passwordHash) {
                userObj.password_hash = passwordHash;
            }

            usersToInsert.push(userObj);
        }

        await Seeder.insertData(User, usersToInsert);
    }

    public async down(): Promise<void> {
        await Seeder.deleteData(User);
    }
}
