import { Router } from 'express';

import { AuthRoutes } from './routes/auth.routes';
import { ClientRoutes } from './routes/client.routes';
import { HardwareRoutes } from './routes/hardware.routes';
import { PcRoutes } from './routes/admin/pc.routes';
import { ReportRoutes } from './routes/admin/report.routes';
import { SystemRoutes } from './routes/admin/system.routes';
import { LiveRoutes } from './routes/admin/live.routes';

const router = Router();
router.use('/auth', AuthRoutes.routes);
router.use('/clients', ClientRoutes.routes);
router.use('/hardware', HardwareRoutes.routes);
router.use('/admin/pcs', PcRoutes.routes);
router.use('/admin/reports', ReportRoutes.routes);
router.use('/admin/system', SystemRoutes.routes);
router.use('/admin/live', LiveRoutes.routes);

export default router;
