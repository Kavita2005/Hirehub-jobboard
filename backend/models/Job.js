const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Engineering',
        'Design',
        'Marketing',
        'Sales',
        'Finance',
        'HR',
        'Product',
        'Data',
        'Other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: 5000,
    },
    requirements: {
      type: String,
      maxlength: 3000,
    },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    applicationUrl: { type: String, trim: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
