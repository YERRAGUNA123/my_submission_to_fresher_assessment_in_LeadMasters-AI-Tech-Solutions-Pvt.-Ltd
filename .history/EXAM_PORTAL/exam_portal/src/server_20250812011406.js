const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://gunadatascientist:zYOrfHLb8RC8kPAy@myproj1.fqwpjfp.mongodb.net/exam_portal?retryWrites=true&w=majority&appName=myproj1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}
).catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);
const examSchema = new mongoose.Schema({
    questions:[{
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
  }],
    timeLimit: { type: Number, default: 60 }
});
const Exam = mongoose.model('questions', examSchema);
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
}); 

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
        res.status(500).json({ error: 'Error signing in' });
    }           
});
app.get('/start-exam', async (req, res) => {
  try {
    const exam = await Exam.findOne(); // You can add filters if needed

    if (!exam) {
      return res.status(404).json({ error: 'No exam found' });
    }

    res.json({
      questions: exam.questions,           // Send all questions as array
      timeleft: exam.timeLimit || 60        // Use schema's timeLimit
    });

  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Server error fetching exam' });
  }
});

app.post("/submit-exam", async (req, res) => {
  try {
    const { answers, userId } = req.body;
    const submission = {
      userId: userId || "anonymous",
      answers,
      submittedAt: new Date()
    };
    await mongoose.connection.collection("exams").insertOne(submission);
    res.json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving exam submission" });
  }
});







app.get('/', (req, res) => {
    res.send('Welcome to the Exam Portal API');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
