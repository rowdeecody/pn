import { Request, Response } from 'express';
import Setting from '../../models/Setting';
import path from 'path';
import fs from 'fs';

class SystemController {
    public async getSettings(req: Request, res: Response) {
        try {
            const settings = await Setting.findAll();
            res.json({ success: true, data: settings });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async updateSettings(req: Request, res: Response) {
        try {
            const { settings } = (req as any).validated;
            for (const s of settings) {
                await Setting.upsert(s);
            }
            res.json({ success: true, message: 'Settings updated' });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public triggerBackup(req: Request, res: Response) {
        const source = path.resolve(__dirname, '../../../../database.sqlite');
        const dest = path.resolve(__dirname, `../../../../backups/backup-${Date.now()}.sqlite`);

        const backupDir = path.dirname(dest);
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        fs.copyFile(source, dest, (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Backup failed: ' + err.message });
            res.json({ success: true, message: 'Backup created', path: dest });
        });
    }

    public restartSystem(req: Request, res: Response) {
        res.json({ success: true, message: 'System restarting...' });
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }

    public restoreBackup(req: Request, res: Response) {
        const { backupPath } = (req as any).validated;
        if (!fs.existsSync(backupPath)) return res.status(400).json({ success: false, error: 'Backup file not found' });

        const dbPath = path.resolve(__dirname, '../../../../database.sqlite');
        fs.copyFile(backupPath, dbPath, (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Restore failed: ' + err.message });
            res.json({ success: true, message: 'Database restored. Please restart server.' });
        });
    }
}

export default new SystemController();
