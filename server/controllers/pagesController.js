// server/controllers/pagesController.js
const Page = require('../models/Page');

exports.createPage = async (req, res) => {
  const { title, parent } = req.body;
  try {
    const page = new Page({ title: title || 'Untitled', owner: req.user._id, parent: parent || null, blocks: [] });
    await page.save();
    res.json(page);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(pages);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ _id: req.params.pageId, owner: req.user._id });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updatePage = async (req, res) => {
  try {
    const { title, blocks, parent } = req.body;
    const page = await Page.findOneAndUpdate(
      { _id: req.params.pageId, owner: req.user._id },
      { $set: { title, blocks, parent, updatedAt: Date.now() } },
      { new: true }
    );
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({ _id: req.params.pageId, owner: req.user._id });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
