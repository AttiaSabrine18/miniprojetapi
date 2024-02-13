const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  status: {
    type: String,
    enum: ["in progress", "completed", "canceled"],
    default: "in progress",
  },
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
