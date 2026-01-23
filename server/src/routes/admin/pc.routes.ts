import express from 'express';
import PcController from '../../controllers/admin/pc.controller';
import CommandRequest from '../../request/admin/pc/command.request';
import GetPcRequest from '../../request/admin/pc/get.pc.request';

const router = express.Router();

router.get('/', PcController.getAllPcs);
router.get('/:id', GetPcRequest.validate, PcController.getPc);
router.post('/:id/command', CommandRequest.validate, PcController.sendCommand);
router.post('/:id/maintenance', GetPcRequest.validate, PcController.toggleMaintenance);
router.post('/:id/reset-time', GetPcRequest.validate, PcController.sendCommand);
router.post('/:id/add-time', CommandRequest.validate, PcController.sendCommand);
router.post('/:id/lock', GetPcRequest.validate, PcController.sendCommand);
router.post('/:id/unlock', GetPcRequest.validate, PcController.sendCommand);
router.post('/:id/shutdown', GetPcRequest.validate, PcController.sendCommand);
router.post('/:id/restart', GetPcRequest.validate, PcController.sendCommand);

export const PcRoutes = { routes: router };
