import path from 'path';
import fs from 'fs';
import Logger from './logger';

class Backup {
    private static instance: Backup;

    public static getInstance() {
        if (!Backup.instance) {
            Backup.instance = new Backup();
        }
        return Backup.instance;
    }

    public static async database() {
        Logger.log().info(`========= START DATABASE BACKUP =========`);
        const backup_dir = path.join(process.cwd(), 'src/v1/database/backup');
        const source = path.join(process.cwd(), 'database.sqlite');
        const dest = path.join(backup_dir, `backup-${Date.now()}.sqlite`);

        if (!fs.existsSync(backup_dir)) {
            fs.mkdirSync(backup_dir, { recursive: true });
        }

        if (fs.existsSync(source)) {
            fs.copyFileSync(source, dest);
            Logger.log().info(`====> database.sqlite backed up to ${dest}`);
        } else {
            console.error('====> database.sqlite not found!');
        }

        Logger.log().info(`========= END DATABASE BACKUP =========`);
    }
}

(async () => {
    await Backup.database();
})();
