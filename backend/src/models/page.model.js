const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled',
    },
    
    // Nơi lưu trữ nội dung block-based
    // Sẽ được Giai đoạn 4 định nghĩa chi tiết hơn
    // (Ví dụ: [{ blockId: '...', type: 'text', data: {...} }])
    content: {
      type: Array,
      default: [],
    },

    // (Tùy chọn, có thể thêm sau)
    // icon: { type: String, default: null },
    // coverImage: { type: String, default: null },

    // Quan trọng: Liên kết trang này với một người dùng
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Tham chiếu đến 'User' model (đã tạo ở GĐ 2)
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Thêm Index (chỉ mục) vào userId
// Điều này TỐI ƯU HÓA mạnh mẽ việc truy vấn
// "lấy tất cả các trang của người dùng X".
pageSchema.index({ userId: 1 });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;