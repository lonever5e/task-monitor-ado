const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// Create a Task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        status: 'Pending'
    };
    tasks.push(newTask);
    res.json(newTask);
});

// Fetch All Tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Simulate Running a Task
// Azure DevOps Pipeline Trigger
app.post('/tasks/:id/run', async (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = 'Running';

    // Trigger Azure DevOps Pipeline
    try {
        await axios.post(
            'https://dev.azure.com/{organization}/{project}/_apis/pipelines/{pipelineId}/runs?api-version=7.1-preview.1',
            {},
            { headers: { Authorization: `Bearer YOUR_PERSONAL_ACCESS_TOKEN` } }
        );
        task.status = 'Completed';
    } catch (error) {
        task.status = 'Failed';
    }

    res.json({ message: 'Task started', task });
});


app.listen(3000, () => console.log('Server running on port 3000'));
