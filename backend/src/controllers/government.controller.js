import GovernmentAlert from '../models/GovernmentAlert.js';
import CitizenReport from '../models/CitizenReport.js';
import RiskAssessment from '../models/RiskAssessment.js';
import { getDatabaseStatus } from '../config/db.js';

// Aggregate dashboard summary indicators
export const getDashboardSummary = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({
        success: true,
        summary: {
          activeAlertsCount: 0,
          pendingReportsCount: 0,
          verifiedReportsCount: 0,
          criticalRiskZonesCount: 0,
        },
        note: 'Database disconnected.',
      });
    }

    const [activeAlerts, pendingReports, verifiedReports, criticalRiskZones] = await Promise.all([
      GovernmentAlert.countDocuments({ status: 'active', expiresAt: { $gte: new Date() } }),
      CitizenReport.countDocuments({ status: 'pending' }),
      CitizenReport.countDocuments({ status: 'verified' }),
      RiskAssessment.countDocuments({ riskLevel: { $in: ['High', 'Severe'] } }),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        activeAlertsCount: activeAlerts,
        pendingReportsCount: pendingReports,
        verifiedReportsCount: verifiedReports,
        criticalRiskZonesCount: criticalRiskZones,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Authority triage: Retrieve reports across all statuses
export const getAllReportsForTriage = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({ success: true, total: 0, data: [], note: 'Database disconnected.' });
    }

    const { status, hazardType, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (hazardType) filter.hazardType = hazardType;

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * parsedLimit;

    const [reports, total] = await Promise.all([
      CitizenReport.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      CitizenReport.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10) || 1,
      limit: parsedLimit,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// Authority triage: Verify, reject, or resolve a report
export const updateReportStatus = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({ success: false, error: 'Database Unavailable' });
    }

    const { status, verifiedBy } = req.body;

    if (!['verified', 'rejected', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Status',
        message: 'Status must be "verified", "rejected", or "resolved".',
      });
    }

    const officialIdentifier = req.user?.name
      ? `${req.user.name} (${req.user.email})`
      : req.user?.email || verifiedBy || 'Government Authority Officer';

    const report = await CitizenReport.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verifiedAt: new Date(),
        verifiedBy: officialIdentifier,
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Report status successfully updated to ${status}.`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// Broadcast an emergency alert
export const createAlert = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({ success: false, error: 'Database Unavailable' });
    }

    const { title, description, disasterType, severity, affectedArea, actionDirectives, expiresAt, issuedBy } = req.body;

    const issuer = req.user?.name
      ? `${req.user.name} (NDIP Authority)`
      : issuedBy || 'National Disaster Management Authority';

    const newAlert = await GovernmentAlert.create({
      title,
      description,
      disasterType,
      severity,
      affectedArea,
      actionDirectives: actionDirectives || [],
      expiresAt,
      issuedBy: issuer,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Official government alert broadcast successfully.',
      data: newAlert,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve active alerts
export const getActiveAlerts = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({ success: true, count: 0, data: [], note: 'Database disconnected.' });
    }

    const alerts = await GovernmentAlert.find({
      status: 'active',
      expiresAt: { $gte: new Date() },
    }).sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel an active alert
export const cancelAlert = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({ success: false, error: 'Database Unavailable' });
    }

    const alert = await GovernmentAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Alert not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert successfully cancelled.',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};
