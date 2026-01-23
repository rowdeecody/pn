import { Request, Response } from 'express';
import Transaction from '../../models/Transaction';
import Session from '../../models/Session';
import PC from '../../models/PC';
import { Op, Sequelize } from 'sequelize';

class ReportController {
    public async getIncomeSummary(req: Request, res: Response) {
        try {
            const total = await Transaction.sum('amount', { where: { type: 'coin_insert' } });
            res.json({ success: true, data: { total } });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getIncomeByPc(req: Request, res: Response) {
        try {
            const rows = await Transaction.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
                include: [{ model: PC, as: 'pc', attributes: ['name'] }],
                group: ['pc.id'],
                where: { type: 'coin_insert' },
            });
            res.json({ success: true, data: rows });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getTransactions(req: Request, res: Response) {
        try {
            const { limit: queryLimit, offset: queryOffset } = (req as any).validated;
            const limit = Number(queryLimit) || 50;
            const offset = Number(queryOffset) || 0;
            const rows = await Transaction.findAll({
                include: [{ model: PC, as: 'pc', attributes: ['name'] }],
                order: [['created_at', 'DESC']],
                limit,
                offset,
            });
            res.json({ success: true, data: rows });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getIncomeRange(req: Request, res: Response) {
        try {
            const { start_date, end_date } = (req as any).validated;
            const rows = await Transaction.findAll({
                attributes: [
                    [Sequelize.fn('date', Sequelize.col('created_at')), 'day'],
                    [Sequelize.fn('sum', Sequelize.col('amount')), 'total'],
                ],
                where: {
                    type: 'coin_insert',
                    created_at: {
                        [Op.between]: [new Date(String(start_date)), new Date(String(end_date))],
                    },
                },
                group: [Sequelize.fn('date', Sequelize.col('created_at'))],
            });
            res.json({ success: true, data: rows });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public async getSessions(req: Request, res: Response) {
        try {
            const { limit: queryLimit, offset: queryOffset } = (req as any).validated;
            const limit = Number(queryLimit) || 50;
            const offset = Number(queryOffset) || 0;
            const rows = await Session.findAll({
                include: [{ model: PC, as: 'pc', attributes: ['name'] }],
                order: [['start_time', 'DESC']],
                limit,
                offset,
            });
            res.json({ success: true, data: rows });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}

export default new ReportController();
