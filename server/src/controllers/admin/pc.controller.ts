import { Request, Response } from 'express';
import PC from '../../models/PC';
import WebSocketService from '../../services/websocket.service';
import CoinStatusService from '../../services/coin_status.service';

class PcController {
    public async getAllPcs(req: Request, res: Response) {
        try {
            const pcs = await PC.findAll({ order: [['id', 'ASC']] });
            res.json({ success: true, data: pcs });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getPc(req: Request, res: Response) {
        try {
            const { id } = (req as any).validated;
            const pc = await PC.findByPk(Number(id));
            if (!pc) return res.status(404).json({ success: false, error: 'PC not found' });
            res.json({ success: true, data: pc });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async sendCommand(req: Request, res: Response) {
        const { id } = req.params;
        try {
            let { command, payload } = (req as any).validated || {};

            if (!command) {
                const path = req.path;
                if (path.endsWith('/lock')) command = 'lock';
                else if (path.endsWith('/unlock')) command = 'unlock';
                else if (path.endsWith('/shutdown')) command = 'shutdown';
                else if (path.endsWith('/restart')) command = 'restart';
                else if (path.endsWith('/reset-time')) command = 'reset_time';
                else if (path.endsWith('/add-time')) command = 'add_time';
            }

            const pc = await PC.findByPk(Number(id));
            if (!pc) return res.status(404).json({ success: false });

            if (command === 'lock') {
                await pc.update({ is_locked: true });
                CoinStatusService.clearPc(pc.id);
            } else if (command === 'unlock') {
                await pc.update({ is_locked: false });
                CoinStatusService.clearPc(pc.id);
            } else if (command === 'add_time') {
                await pc.increment('remaining_time_seconds', { by: payload?.seconds || 0 });
            } else if (command === 'reset_time') {
                await pc.update({ remaining_time_seconds: 0 });
            } else if (command === 'shutdown') {
                await pc.update({ status: 'offline' });
            }

            const sent = WebSocketService.sendToPc(pc.id, 'COMMAND', { command, payload });
            res.json({ success: true, message: `Command ${command} sent` });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async toggleMaintenance(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const pc = await PC.findByPk(Number(id));
            if (!pc) return res.status(404).json({ success: false });

            const newStatus = pc.status === 'maintenance' ? 'offline' : 'maintenance';
            await pc.update({ status: newStatus });
            WebSocketService.broadcastToAdmins('PC_UPDATE', { pcId: pc.id, status: newStatus });
            res.json({ success: true, status: newStatus });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}

export default new PcController();
