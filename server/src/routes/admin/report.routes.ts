import express from 'express';
import ReportController from '../../controllers/admin/report.controller';
import DateRangeRequest from '../../request/admin/report/date.range.request';
import PaginationRequest from '../../request/admin/report/pagination.request';

const router = express.Router();

router.get('/income/summary', ReportController.getIncomeSummary);
router.get('/income/by-pc', ReportController.getIncomeByPc);
router.get('/income/range', DateRangeRequest.validate, ReportController.getIncomeRange);
router.get('/transactions', PaginationRequest.validate, ReportController.getTransactions);
router.get('/sessions', PaginationRequest.validate, ReportController.getSessions);

export const ReportRoutes = { routes: router };
