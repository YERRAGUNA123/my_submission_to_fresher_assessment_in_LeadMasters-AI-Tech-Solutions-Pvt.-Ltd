const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if invalid token
    req.user = user; // Attach decoded user info (e.g., username) to request
    next();
  });
}

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://username:password@myproj1.fqwpjfp.mongodb.net/exam_portal?retryWrites=true&w=majority&appName=myproj1', {
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

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
app.get('/start-exam', async (req, res) => {
  try {
    const exam = await Exam.findOne(); // You can add filters if needed

    if (!exam) {
      return res.status(404).json({ error: 'No exam found' });
    }

    // ___ Start of added shuffle code ___
    const shuffledQuestions = exam.questions.slice(); // make a copy of the questions array
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    // ___ End of added shuffle code ___

    res.json({
      questions:shuffledQuestions,           // Use shuffled questions instead of exam.questions
      timeleft: exam.timeLimit || 60        // Use schema's timeLimit
    });

  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Server error fetching exam' });
  }
});

// Update exam questions - add multiple questions or replace all questions
app.put('/update-exam-questions', async (req, res) => {
  try {
    const { questions, timeLimit } = req.body;

    // Validation: questions should be an array
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions must be an array' });
    }

    // Update the single exam document - replace the questions array and optionally timeLimit
    const exam = await Exam.findOneAndUpdate(
      {},
      { $set: { questions, timeLimit } },
      { new: true, upsert: true } // create if not exist
    );

    res.json({ message: 'Exam questions updated successfully', exam });
  } catch (error) {
    console.error('Error updating exam questions:', error);
    res.status(500).json({ error: 'Server error updating exam questions' });
  }
});

app.post("/submit-exam", authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.username; // comes from decoded JWT

    const submission = {
      userId,
      answers,
      submittedAt: new Date(),
    };

    await mongoose.connection.collection("submissions").insertOne(submission);
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

