import CitizenReport from '../models/CitizenReport.js';
import { getDatabaseStatus } from '../config/db.js';
import { validateCoordinates } from '../middleware/validate.js';

// Submit a new citizen report
export const createReport = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message: 'MongoDB Atlas is not connected. Citizen report could not be submitted.',
      });
    }

    const { hazardType, coordinates, address, description, mediaUrl, severitySelfReported } = req.body;

    if (!coordinates || !validateCoordinates(coordinates)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Coordinates',
        message: 'Coordinates must be provided as [longitude, latitude] within valid geographic bounds.',
      });
    }

    const newReport = await CitizenReport.create({
      hazardType,
      location: {
        type: 'Point',
        coordinates,
      },
      address: address || '',
      description,
      mediaUrl: mediaUrl || null,
      severitySelfReported: severitySelfReported || 'medium',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Citizen report submitted successfully. Awaiting authority triage.',
      data: newReport,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve public verified reports
export const getPublicReports = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({ success: true, total: 0, data: [], note: 'Database disconnected.' });
    }

    const { hazardType, limit = 20, page = 1 } = req.query;

    const filter = { status: 'verified' };
    if (hazardType) filter.hazardType = hazardType;

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
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

// Get single report by ID
export const getReportById = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({ success: false, error: 'Database Unavailable' });
    }

    const report = await CitizenReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
