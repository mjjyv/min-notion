const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho một Block
const blockSchema = new Schema({
  type: {
    type: String,
    enum: ['text', 'todo'],
    required: true,
  },
  data: {
    type: Object,
    required: true,
    default: {},
  },
});

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled',
    },
    icon: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    content: [blockSchema],
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.index({ userId: 1 });

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;