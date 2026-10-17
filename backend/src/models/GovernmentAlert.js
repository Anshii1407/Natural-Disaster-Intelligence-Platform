import mongoose from 'mongoose';

const governmentAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
      trim: true,
    },
    disasterType: {
      type: String,
      required: [true, 'Disaster type is required'],
      enum: {
        values: ['flood', 'heatwave'],
        message: '{VALUE} must be "flood" or "heatwave".',
      },
      index: true,
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: {
        values: ['Advisory', 'Watch', 'Warning', 'Emergency'],
        message: '{VALUE} is not a recognized severity level.',
      },
      index: true,
    },
    affectedArea: {
      regionName: {
        type: String,
        required: [true, 'Region name is required'],
        trim: true,
      },
      location: {
        type: {
          type: String,
          enum: ['Point', 'Polygon'],
          default: 'Point',
        },
        coordinates: {
          type: mongoose.Schema.Types.Mixed,
          required: [true, 'Geospatial coordinates are required'],
        },
      },
      radiusKm: {
        type: Number,
        default: 10,
      },
    },
    actionDirectives: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'cancelled', 'expired'],
        message: '{VALUE} is not a valid alert status.',
      },
      default: 'active',
      index: true,
    },
    issuedBy: {
      type: String,
      default: 'National Disaster Management Authority',
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration timestamp is required'],
    },
  },
  {
    timestamps: true,
  }
);

governmentAlertSchema.index({ 'affectedArea.location': '2dsphere' });

export default mongoose.model('GovernmentAlert', governmentAlertSchema);
