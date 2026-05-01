const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=300'
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
