import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { username, password } = (req as any).validated;
            const user = await User.findOne({ where: { username } });
            if (!user) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

            const match = bcrypt.compareSync(password, user.password_hash);
            if (match) {
                (req.session as any).userId = user.id;
                (req.session as any).role = user.role;
                return res.json({ success: true, data: { id: user.id, username: user.username, role: user.role } });
            }
            res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
        } catch (e: any) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    public logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.json({ success: true, message: 'Logged out' });
        });
    }

    public me(req: Request, res: Response) {
        if ((req.session as any).userId) {
            res.json({
                success: true,
                data: { id: (req.session as any).userId, role: (req.session as any).role },
            });
        } else {
            res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
        }
    }
}

export default new AuthController();
