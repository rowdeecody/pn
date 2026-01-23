import express from 'express';
import LiveController from '../../controllers/admin/live.controller';
import LiveScreenshotRequest from '../../request/admin/live/screenshot.request';

const router = express.Router();

router.get('/pcs', LiveController.getLivePcs);
router.get('/screenshot/:pc_id', LiveScreenshotRequest.validate, LiveController.requestScreenshot);

export const LiveRoutes = { routes: router };
