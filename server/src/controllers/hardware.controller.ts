import { Request, Response } from 'express';
import PC from '../models/PC';
import Transaction from '../models/Transaction';
import Session from '../models/Session';
import Setting from '../models/Setting';
import WebSocketService from '../services/websocket.service';
import CoinStatusService from '../services/coin_status.service';
import Logger from '../core/logger';

class HardwareController {
    public async insertCoin(req: Request, res: Response) {
        try {
            const { amount } = (req as any).validated;
            const pc = await PC.findOne({ where: { status: 'active' }, order: [['updated_at', 'DESC']] });

            if (!pc) {
                await Transaction.create({ amount, type: 'coin_insert', pc_id: null });
                return res.json({ success: false, message: 'No PC waiting for coin' });
            }

            const setting = await Setting.findByPk('minutes_per_peso');
            const minutesPerPeso = setting ? parseFloat(setting.value) : 5;
            const timeToAddSeconds = amount * minutesPerPeso * 60;

            await pc.increment('remaining_time_seconds', { by: timeToAddSeconds });
            await Transaction.create({ pc_id: pc.id, amount, type: 'coin_insert' });

            const session = await Session.findOne({ where: { pc_id: pc.id, status: 'active' } });
            if (session) {
                await session.update({
                    amount_paid: Number(session.amount_paid) + amount,
                    coins_inserted: session.coins_inserted + 1,
                });
            } else {
                await Session.create({ pc_id: pc.id, amount_paid: amount, coins_inserted: 1, status: 'active' });
            }

            await pc.reload();
            await CoinStatusService.resetTimeout(pc.id);
            WebSocketService.sendToPc(pc.id, 'MONEY_IN', {
                amount,
                timeAdded: timeToAddSeconds,
                totalTime: pc.remaining_time_seconds,
            });
            WebSocketService.broadcastToAdmins('NEW_TRANSACTION', { pcName: pc.name, amount });

            res.json({ success: true, message: `Added ${amount} to ${pc.name}` });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public getStatus(req: Request, res: Response) {
        res.json({ success: true, status: 'ready' });
    }

    public getHeartbeat(req: Request, res: Response) {
        res.json({ success: true, message: 'pong' });
    }

    public logRejected(req: Request, res: Response) {
        const { amount, reason } = (req as any).validated;
        Logger.log().info(`Coin rejected: ${amount}, reason: ${reason}`);
        res.json({ success: true, message: 'Logged rejection' });
    }
}

export default new HardwareController();
