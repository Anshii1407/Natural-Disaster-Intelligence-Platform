import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema(
  {
    disasterType: {
      type: String,
      required: [true, 'Disaster type is required'],
      enum: {
        values: ['flood', 'heatwave'],
        message: '{VALUE} is not a supported disaster type. Must be "flood" or "heatwave".',
      },
      index: true,
    },
    region: {
      type: String,
      required: [true, 'Region name is required'],
      trim: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates [longitude, latitude] are required'],
      },
    },
    environmentalMetrics: {
      // Flood parameters
      rainfall_mm: { type: Number, default: null },
      river_water_level_m: { type: Number, default: null },
      soil_moisture_pct: { type: Number, default: null },
      elevation_m: { type: Number, default: null },

      // Heatwave parameters
      temperature_celsius: { type: Number, default: null },
      humidity_pct: { type: Number, default: null },
      solar_radiation_index: { type: Number, default: null },
      consecutive_hot_days: { type: Number, default: null },
    },
    riskLevel: {
      type: String,
      required: [true, 'Risk level is required'],
      enum: {
        values: ['Low', 'Moderate', 'High', 'Severe'],
        message: '{VALUE} is not a valid risk level.',
      },
      index: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    modelVersion: {
      type: String,
      default: 'rf-v1.0',
    },
    assessedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

riskAssessmentSchema.index({ location: '2dsphere' });

export default mongoose.model('RiskAssessment', riskAssessmentSchema);
