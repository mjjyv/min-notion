const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NÂNG CẤP GĐ 4: Định nghĩa schema cho một Block
// Mongoose sẽ tự động gán _id cho mỗi block
const blockSchema = new Schema({
  type: {
    type: String,
    enum: ['text', 'todo'], // Có thể mở rộng (heading, image...)
    required: true,
  },
  data: {
    type: Object, // Sẽ chứa:
                  // 1. { text: "...", checked: false } cho 'todo'
                  // 2. { contentState: ... } (JSON) cho 'text' (Draft.js)
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
    
    // NÂNG CẤP GĐ 4: 'content' giờ là một mảng các 'blockSchema'
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