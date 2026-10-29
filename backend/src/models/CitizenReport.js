import mongoose from 'mongoose';

const citizenReportSchema = new mongoose.Schema(
  {
    hazardType: {
      type: String,
      required: [true, 'Hazard type is required'],
      enum: {
        values: ['flood', 'heatwave', 'waterlogging', 'infrastructure_damage', 'other'],
        message: '{VALUE} is not a valid hazard category.',
      },
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
    address: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected', 'resolved'],
        message: '{VALUE} is not a valid report status.',
      },
      default: 'pending',
      index: true,
    },
    severitySelfReported: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

citizenReportSchema.index({ location: '2dsphere' });

export default mongoose.model('CitizenReport', citizenReportSchema);
