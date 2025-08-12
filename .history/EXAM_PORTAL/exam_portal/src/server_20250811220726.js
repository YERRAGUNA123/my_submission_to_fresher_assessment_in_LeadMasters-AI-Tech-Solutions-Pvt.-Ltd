const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://gunadatascientist:zYOrfHLb8RC8kPAy@myproj1.fqwpjfp.mongodb.net/exam_portal?retryWrites=true&w=majority&appName=myproj1')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Exam Schema
const examSchema = new mongoose.Schema({
    questions: [{
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true }
    }],
    timeLimit: { type: Number, default: 60 }
});
const Exam = mongoose.model('Exam', examSchema);

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: 'Error registering user' });
    }
});

// Signin endpoint
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });
        res.json({ message: 'Signin successful', token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Error signing in' });
    }
});

// Start exam endpoint
app.get('/start-exam', async (req, res) => {
    try {
        const count = await Exam.countDocuments();
        if (count === 0) {
            return res.status(404).json({ error: 'No exams found' });
        }

        const randomExamIndex = Math.floor(Math.random() * count);
        const randomExam = await Exam.findOne().skip(randomExamIndex);

        if (!randomExam || randomExam.questions.length === 0) {
            return res.status(404).json({ error: 'No questions found in exam' });
        }

        res.json({
            Questions: randomExam.questions,
            timeleft: randomExam.timeLimit || 60
        });

    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ error: 'Server error fetching exam' });
    }
});

// Get specific question endpoint
app.get('/get-question/:index', async (req, res) => {
    try {
        const exam = await Exam.findOne();
        if (!exam) return res.status(404).json({ error: 'No exam found' });

        const index = parseInt(req.params.index, 10);
        if (isNaN(index) || index < 0 || index >= exam.questions.length) {
            return res.status(400).json({ error: 'Invalid question index' });
        }

        const questionObj = exam.questions[index];
        res.json({
            question: questionObj.questionText,
            options: questionObj.options,
            timeleft: exam.timeLimit || 60
        });

    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Server error fetching question' });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Exam Portal API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

