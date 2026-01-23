import express from 'express';
import SystemController from '../../controllers/admin/system.controller';
import UpdateSettingsRequest from '../../request/admin/system/update.settings.request';
import RestoreBackupRequest from '../../request/admin/system/restore.backup.request';

const router = express.Router();

router.get('/settings', SystemController.getSettings);
router.post('/settings', UpdateSettingsRequest.validate, SystemController.updateSettings);
router.post('/backup', SystemController.triggerBackup);
router.post('/restore', RestoreBackupRequest.validate, SystemController.restoreBackup);
router.post('/restart', SystemController.restartSystem);

export const SystemRoutes = { routes: router };
