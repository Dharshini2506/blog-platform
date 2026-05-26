const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'],
    default: 'Other',
  },
  tags: [String],
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/800x400',
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Post', postSchema);