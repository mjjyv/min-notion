import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: { type: String },
  checked: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const PageSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null },
  blocks: [BlockSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PageSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const Page = mongoose.model("Page", PageSchema);
export default Page;
