import express from 'express';
import ClientController from '../controllers/client.controller';

import RegisterPcRequest from '../request/client/pc/register.pc.request';
import VerifyPcRequest from '../request/client/pc/verify.request';
import PcIdRequest from '../request/client/pc/pc_id.request';
import PcIdQueryRequest from '../request/client/pc/pc_id_query.request';

const router = express.Router();

router.post('/register', RegisterPcRequest.validate, ClientController.register);
router.post('/heartbeat', PcIdRequest.validate, ClientController.heartbeat);
router.get('/config', ClientController.getConfig);
router.post('/request-coin', PcIdRequest.validate, ClientController.requestCoin);
router.post('/cancel-coin', PcIdRequest.validate, ClientController.cancelCoin);
router.post('/lock', PcIdRequest.validate, ClientController.confirmLock);
router.post('/unlock', PcIdRequest.validate, ClientController.confirmUnlock);
router.get('/session', PcIdQueryRequest.validate, ClientController.getSession);
router.post('/shutdown', PcIdRequest.validate, ClientController.confirmShutdown);
router.post('/restart', PcIdRequest.validate, ClientController.confirmRestart);
router.post('/verify', VerifyPcRequest.validate, ClientController.verify);

export const ClientRoutes = { routes: router };
