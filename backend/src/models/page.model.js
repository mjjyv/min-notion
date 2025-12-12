const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho một Block
const blockSchema = new Schema({
  type: {
    type: String,
    // SỬA LỖI: Thêm 'image' vào danh sách enum
    // Lưu ý: DraftJS xử lý header-one, header-two dưới dạng 'text' block có style,
    // nhưng nếu bạn tách riêng logic block, hãy thêm vào đây cho chắc.
    enum: ['text', 'todo', 'image'], 
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