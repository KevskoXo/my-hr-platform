//ratingService/controllers/ratingController.js

const Rating = require('../models/ratingModel');

exports.submitRating = async (req, res) => {
  try {
    const { company, job, rating, feedback } = req.body;
    const user = req.user.userId;

    const newRating = new Rating({
      user,
      company,
      job,
      rating,
      feedback,
    });

    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Error submitting rating' });
  }
};

exports.getRatingsForCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const ratings = await Rating.find({ company: companyId }).populate('user', 'name');

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Error fetching ratings' });
  }
};

exports.getRatingsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const ratings = await Rating.find({ job: jobId }).populate('user', 'name');

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Error fetching ratings' });
  }
};