import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
  levels: [{
    level: Number,
    points: Number,
    timeTaken: Number,
    completedAt: Date,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);