import PC from '../models/PC';
import Setting from '../models/Setting';
import WebSocketService from './websocket.service';
import { PC_STATUS } from '../utils/enums/PcEnum';
import Logger from '../core/logger';

class CoinStatusService {
    private timeoutMap: Map<number, NodeJS.Timeout> = new Map();

    /**
     * Attempts to activate a PC for coin insertion.
     * Only allows activation if no other PC is currently active.
     */
    public async activatePc(pcId: number) {
        // 1. Check if this PC is already active
        const self = await PC.findByPk(pcId);
        if (self && self.status === PC_STATUS.Active) {
            await this.resetTimeout(pcId);
            return { status: PC_STATUS.Active, message: 'Timer reset' };
        }

        // 2. Check if any other PC is currently active
        const existingActive = await PC.findOne({ where: { status: PC_STATUS.Active } });

        if (existingActive) {
            throw new Error('Another PC is currently using the coin slot. Please wait.');
        }

        // 3. No one active, set to active
        await PC.update({ status: PC_STATUS.Active }, { where: { id: pcId } });

        // 4. Start the timeout
        await this.resetTimeout(pcId);
        return { status: PC_STATUS.Active, message: 'Activated' };
    }

    /**
     * Resets the idle timeout for the current active PC.
     */
    public async resetTimeout(pcId: number) {
        if (this.timeoutMap.has(pcId)) {
            clearTimeout(this.timeoutMap.get(pcId)!);
        }

        const setting = await Setting.findByPk('idle_timeout_seconds');
        const timeoutSeconds = setting ? parseInt(setting.value) : 60;

        const timeout = setTimeout(async () => {
            Logger.log().info(`PC ${pcId} idle timeout reached.`);
            await PC.update({ status: PC_STATUS.Online }, { where: { id: pcId, status: PC_STATUS.Active } });
            WebSocketService.sendToPc(pcId, 'COIN_TIMEOUT', { message: 'Idle timeout reached' });

            this.timeoutMap.delete(pcId);
        }, timeoutSeconds * 1000);

        this.timeoutMap.set(pcId, timeout);
    }

    /**
     * Manually clear activation.
     */
    public async clearPc(pcId: number) {
        if (this.timeoutMap.has(pcId)) {
            clearTimeout(this.timeoutMap.get(pcId)!);
            this.timeoutMap.delete(pcId);
        }

        const pc = await PC.findByPk(pcId);
        if (pc && pc.status === PC_STATUS.Active) {
            await pc.update({ status: PC_STATUS.Online });
        }
    }

    public async deactivateAll() {
        for (const [id, timer] of this.timeoutMap.entries()) {
            clearTimeout(timer);
        }
        this.timeoutMap.clear();
        await PC.update({ status: PC_STATUS.Online }, { where: { status: PC_STATUS.Active } });
    }
}

export default new CoinStatusService();
