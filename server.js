
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost/todo-list-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
const Task = require('./models/Task');
app.use(bodyParser.json());
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({ title });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { title }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
