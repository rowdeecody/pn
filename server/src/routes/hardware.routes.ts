import express from 'express';
import HardwareController from '../controllers/hardware.controller';
import CoinInsertRequest from '../request/hardware/coin.insert.request';
import CoinRejectedRequest from '../request/hardware/coin.rejected.request';

const router = express.Router();

router.post('/coin', CoinInsertRequest.validate, HardwareController.insertCoin);
router.get('/status', HardwareController.getStatus);
router.get('/heartbeat', HardwareController.getHeartbeat);
router.post('/coin/rejected', CoinRejectedRequest.validate, HardwareController.logRejected);

export const HardwareRoutes = { routes: router };
