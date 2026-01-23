import { Request, Response } from 'express';
import PC from '../models/PC';
import Setting from '../models/Setting';
import WebSocketService from '../services/websocket.service';
import CoinStatusService from '../services/coin_status.service';
import { PC_STATUS } from '../utils/enums/PcEnum';

class ClientController {
    public async register(req: Request, res: Response) {
        try {
            const validated = (req as any).validated;
            const pc = await PC.create(validated);

            res.json({ success: true, data: pc });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async heartbeat(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            const pc = await PC.findByPk(pc_id);
            if (pc) {
                const updateData: any = { last_heartbeat: new Date() };
                if (pc.status === PC_STATUS.Offline) updateData.status = PC_STATUS.Online;
                await pc.update(updateData);
            }
            res.json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getConfig(req: Request, res: Response) {
        try {
            const settings = await Setting.findAll();
            const data: any = {};
            settings.forEach((s) => (data[s.key] = s.value));
            res.json({ success: true, data });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async requestCoin(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            const result = await CoinStatusService.activatePc(pc_id);

            const pc = await PC.findByPk(pc_id);
            if (pc && result.status === PC_STATUS.Active) {
                WebSocketService.broadcastToAdmins('PC_ACTIVE_FOR_COIN', { pcId: pc.id, name: pc.name });
            }

            res.json({
                success: true,
                data: result,
            });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async cancelCoin(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            await PC.update({ status: PC_STATUS.Online }, { where: { id: pc_id, status: PC_STATUS.Active } });
            CoinStatusService.clearPc(pc_id);
            res.json({ success: true, message: 'Cancelled' });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async confirmLock(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            await PC.update({ is_locked: true }, { where: { id: pc_id } });
            CoinStatusService.clearPc(pc_id);
            WebSocketService.broadcastToAdmins('PC_UPDATE', { pcId: pc_id, is_locked: 1 });
            res.json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async confirmUnlock(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            await PC.update({ is_locked: false }, { where: { id: pc_id } });
            CoinStatusService.clearPc(pc_id);
            WebSocketService.broadcastToAdmins('PC_UPDATE', { pcId: pc_id, is_locked: 0 });
            res.json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async confirmShutdown(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            await PC.update({ status: PC_STATUS.Offline }, { where: { id: pc_id } });
            WebSocketService.broadcastToAdmins('PC_UPDATE', { pcId: pc_id, status: PC_STATUS.Offline });
            res.json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async confirmRestart(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            await PC.update({ status: PC_STATUS.Restarting }, { where: { id: pc_id } });
            WebSocketService.broadcastToAdmins('PC_UPDATE', { pcId: pc_id, status: PC_STATUS.Restarting });
            res.json({ success: true });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getSession(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            const pc = await PC.findByPk(Number(pc_id));
            if (!pc) return res.status(404).json({ success: false });
            res.json({ success: true, data: pc });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async verify(req: Request, res: Response) {
        try {
            const { mac_address } = (req as any).validated;
            const pc = await PC.findOne({ where: { mac_address } });
            if (pc) res.json({ success: true, data: pc });
            else res.status(404).json({ success: false, error: 'Not registered' });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}

export default new ClientController();
