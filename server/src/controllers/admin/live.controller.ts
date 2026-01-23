import { Request, Response } from 'express';
import PC from '../../models/PC';
import WebSocketService from '../../services/websocket.service';
import { Op } from 'sequelize';

class LiveController {
    public async getLivePcs(req: Request, res: Response) {
        try {
            const pcs = await PC.findAll({
                where: {
                    status: { [Op.in]: ['online', 'active'] },
                },
            });
            res.json({ success: true, data: pcs });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async requestScreenshot(req: Request, res: Response) {
        try {
            const { pc_id } = (req as any).validated;
            WebSocketService.sendToPc(Number(pc_id), 'COMMAND', { command: 'screenshot' });
            res.json({ success: true, message: 'Requested' });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}

export default new LiveController();
