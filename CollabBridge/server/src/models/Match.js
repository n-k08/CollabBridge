const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    commonSkills: {
      type: [String],
      default: [],
    },
    commonInterests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ users: 1 });
matchSchema.index({ 'users': 1, createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema);
