import RiskAssessment from '../models/RiskAssessment.js';
import { getDatabaseStatus } from '../config/db.js';
import { validateCoordinates } from '../middleware/validate.js';

// Ingest or record an assessment
export const createAssessment = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message: 'MongoDB Atlas is not connected. Assessment could not be persisted.',
      });
    }

    const { disasterType, region, coordinates, environmentalMetrics, riskLevel, riskScore, modelVersion } = req.body;

    if (!coordinates || !validateCoordinates(coordinates)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Coordinates',
        message: 'Coordinates must be [longitude, latitude] within valid geographic bounds.',
      });
    }

    const assessment = await RiskAssessment.create({
      disasterType,
      region,
      location: {
        type: 'Point',
        coordinates,
      },
      environmentalMetrics: environmentalMetrics || {},
      riskLevel,
      riskScore: riskScore !== undefined ? riskScore : 0,
      modelVersion: modelVersion || 'rf-v1.0',
    });

    res.status(201).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// Get latest assessments for flood and heatwave
export const getLatestAssessments = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({
        success: true,
        data: [],
        note: 'Database disconnected. No records available.',
      });
    }

    const [latestFlood, latestHeatwave] = await Promise.all([
      RiskAssessment.findOne({ disasterType: 'flood' }).sort({ assessedAt: -1 }),
      RiskAssessment.findOne({ disasterType: 'heatwave' }).sort({ assessedAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        flood: latestFlood || null,
        heatwave: latestHeatwave || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Query assessment history
export const getAssessmentHistory = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({
        success: true,
        data: [],
        total: 0,
        note: 'Database disconnected.',
      });
    }

    const { disasterType, region, riskLevel, limit = 20, page = 1 } = req.query;

    const filter = {};
    if (disasterType) filter.disasterType = disasterType;
    if (region) filter.region = new RegExp(region, 'i');
    if (riskLevel) filter.riskLevel = riskLevel;

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * parsedLimit;

    const [records, total] = await Promise.all([
      RiskAssessment.find(filter).sort({ assessedAt: -1 }).skip(skip).limit(parsedLimit),
      RiskAssessment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10) || 1,
      limit: parsedLimit,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};
