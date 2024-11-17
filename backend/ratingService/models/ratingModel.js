/**
 * @fileoverview Mongoose model for the Rating entity.
 * 
 * This model defines the schema for storing user ratings for companies and jobs.
 * Each rating is associated with a user, a company, and optionally a job.
 * Ratings include a numerical score, optional feedback, and a timestamp.
 * 
 * @module models/ratingModel
 */

 /**
    * Mongoose schema for the Rating model.
    * 
    * @typedef {Object} Rating
    * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User who gave the rating.
    * @property {mongoose.Schema.Types.ObjectId} company - Reference to the Company being rated.
    * @property {mongoose.Schema.Types.ObjectId} [job] - Optional reference to the Job being rated.
    * @property {number} rating - Numerical rating score (1-5).
    * @property {string} [feedback] - Optional textual feedback.
    * @property {Date} timestamp - Timestamp of when the rating was created.
    */


const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Rating', ratingSchema);