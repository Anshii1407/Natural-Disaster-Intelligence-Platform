import RiskAssessment from '../models/RiskAssessment.js';
import CitizenReport from '../models/CitizenReport.js';
import GovernmentAlert from '../models/GovernmentAlert.js';
import { getDatabaseStatus } from '../config/db.js';
import { validateCoordinates } from '../middleware/validate.js';

// Aggregate consolidated GeoJSON layers for Leaflet
export const getMapLayers = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({
        type: 'FeatureCollection',
        features: [],
        note: 'Database disconnected.',
      });
    }

    const [riskAssessments, verifiedReports, activeAlerts] = await Promise.all([
      RiskAssessment.find({ riskLevel: { $in: ['Moderate', 'High', 'Severe'] } })
        .sort({ assessedAt: -1 })
        .limit(100),
      CitizenReport.find({ status: 'verified' })
        .sort({ verifiedAt: -1 })
        .limit(100),
      GovernmentAlert.find({ status: 'active', expiresAt: { $gte: new Date() } }),
    ]);

    const features = [];

    // 1. Risk zones (Module 1)
    for (const r of riskAssessments) {
      features.push({
        type: 'Feature',
        id: `risk-${r._id}`,
        geometry: r.location,
        properties: {
          layerType: 'risk_zone',
          disasterType: r.disasterType,
          region: r.region,
          riskLevel: r.riskLevel,
          riskScore: r.riskScore,
          assessedAt: r.assessedAt,
        },
      });
    }

    // 2. Verified Citizen Reports (Module 3)
    for (const report of verifiedReports) {
      features.push({
        type: 'Feature',
        id: `report-${report._id}`,
        geometry: report.location,
        properties: {
          layerType: 'citizen_report',
          hazardType: report.hazardType,
          address: report.address,
          description: report.description,
          mediaUrl: report.mediaUrl,
          severity: report.severitySelfReported,
          submittedAt: report.createdAt,
        },
      });
    }

    // 3. Government Alerts (Module 4)
    for (const alert of activeAlerts) {
      features.push({
        type: 'Feature',
        id: `alert-${alert._id}`,
        geometry: alert.affectedArea.location,
        properties: {
          layerType: 'government_alert',
          title: alert.title,
          disasterType: alert.disasterType,
          severity: alert.severity,
          regionName: alert.affectedArea.regionName,
          radiusKm: alert.affectedArea.radiusKm,
          actionDirectives: alert.actionDirectives,
          expiresAt: alert.expiresAt,
        },
      });
    }

    res.status(200).json({
      type: 'FeatureCollection',
      metadata: {
        totalFeatures: features.length,
        riskZonesCount: riskAssessments.length,
        citizenReportsCount: verifiedReports.length,
        activeAlertsCount: activeAlerts.length,
      },
      features,
    });
  } catch (error) {
    next(error);
  }
};

// Radius search for hazards around coordinates
export const getNearbyHazards = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(200).json({ success: true, count: 0, reports: [], assessments: [] });
    }

    const { lng, lat, radiusKm = 25 } = req.query;

    const lonNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    const radiusNum = parseFloat(radiusKm);

    if (isNaN(lonNum) || isNaN(latNum) || !validateCoordinates([lonNum, latNum])) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Coordinates',
        message: 'Query parameters "lng" and "lat" must represent valid coordinates.',
      });
    }

    // Earth radius in kilometers = 6378.1
    const radians = radiusNum / 6378.1;

    const [reports, assessments] = await Promise.all([
      CitizenReport.find({
        location: {
          $geoWithin: {
            $centerSphere: [[lonNum, latNum], radians],
          },
        },
      }).limit(50),
      RiskAssessment.find({
        location: {
          $geoWithin: {
            $centerSphere: [[lonNum, latNum], radians],
          },
        },
      }).limit(50),
    ]);

    res.status(200).json({
      success: true,
      center: [lonNum, latNum],
      radiusKm: radiusNum,
      count: reports.length + assessments.length,
      reports,
      assessments,
    });
  } catch (error) {
    next(error);
  }
};
