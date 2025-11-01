// server/routes/pages.js
import express from "express";
import Page from "../models/Page.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= CREATE PAGE =================
router.post("/", auth, async (req, res) => {
  try {
    const { title, parentId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const page = new Page({
      title: title || "Trang mới",
      owner: req.user._id,
      parentId: parentId || null
    });

    await page.save();
    res.status(201).json({ page });
  } catch (err) {
    console.error("POST /pages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET PAGES TREE =================
router.get("/tree", auth, async (req, res) => {
  try {
    const pages = await Page.find({ owner: req.user._id }).lean();

    // Build tree structure
    const map = {};
    pages.forEach(p => (map[p._id] = { ...p, children: [] }));
    const tree = [];

    pages.forEach(p => {
      if (p.parentId) {
        map[p.parentId]?.children.push(map[p._id]);
      } else {
        tree.push(map[p._id]);
      }
    });

    res.json(tree);
  } catch (err) {
    console.error("GET /pages/tree error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PAGE =================
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, blocks } = req.body;
    const page = await Page.findOne({ _id: req.params.id, owner: req.user._id });
    if (!page) return res.status(404).json({ message: "Page not found" });

    if (title !== undefined) page.title = title;
    if (blocks !== undefined) page.blocks = blocks;

    await page.save();
    res.json({ page });
  } catch (err) {
    console.error("PUT /pages/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE PAGE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, owner: req.user._id });
    if (!page) return res.status(404).json({ message: "Page not found" });

    // Recursive delete all child pages
    const deleteRecursive = async (pageId) => {
      const children = await Page.find({ parentId: pageId });
      for (const child of children) {
        await deleteRecursive(child._id);
      }
      await Page.deleteOne({ _id: pageId });
    };

    await deleteRecursive(page._id);
    res.json({ message: "Page deleted" });
  } catch (err) {
    console.error("DELETE /pages/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
