# Exam Portal - Online Examination System

A full-stack web application for conducting online examinations with user authentication, random question generation, timer functionality, and automated grading.

## 🚀 Features

- **User Authentication**: Secure sign-up and sign-in with JWT tokens
- **Exam Management**: Start exam with random questions from backend
- **Timer System**: Built-in countdown timer for each exam session
- **Question Format**: Multiple choice questions with single correct answer
- **Real-time Updates**: Update questions via backend routes
- **Responsive Design**: Clean and intuitive user interface
- **Secure Backend**: Password hashing and token-based authentication

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📁 Project Structure

```
EXAM_PORTAL/
├── exam_portal/
│   ├── src/
│   │   ├── Sighnin.js          # Sign-in component
│   │   ├── Sighnup.js          # Sign-up component
│   │   ├── StartExam.js        # Main exam interface
│   │   ├── index.js            # App entry point
│   │   └── server.js           # Express server
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd EXAM_PORTAL/exam_portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam_portal
JWT_SECRET=your-secret-key
```

4. **Start MongoDB**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

5. **Start the development server**
```bash
# Start backend server
npm start

# In another terminal, start React app
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - User login

### Exam Management
- `GET /start-exam` - Get random questions for exam
- `POST /submit-exam` - Submit exam answers
- `PUT /update-exam-questions` - Update exam questions (admin)

## 📝 Question Format

Questions are stored in the following JSON format:
```json
{
  "questions": [
    {
      "questionText": "What is the capital city of Australia?",
      "options": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      "correctAnswer": "Canberra"
    }
  ],
  "timeLimit": 120
}
```

## 🔧 Configuration

### Database Setup
The application uses MongoDB with the following collections:
- **users**: Stores user credentials
- **questions**: Stores exam questions

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

## 🎯 Usage Guide

### For Students
1. **Sign Up**: Create a new account with username and password
2. **Sign In**: Login with your credentials
3. **Start Exam**: Click "Start Exam" to begin
4. **Answer Questions**: Select answers for each question
5. **Submit**: Click "Submit Exam" when finished

### For Administrators
1. Use Postman or similar tool to access backend routes
2. Update questions via `/update-exam-questions` endpoint
3. Monitor exam submissions and results

## 🧪 Testing

### Manual Testing
1. Test user registration and login
2. Verify exam start functionality
3. Check timer countdown
4. Test question navigation
5. Verify answer submission

### API Testing with Postman
```bash
# Test sign-up
POST http://localhost:5000/signup
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpass123"
}

# Test sign-in
POST http://localhost:5000/signin
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpass123"
}

# Test exam start (with token)
GET http://localhost:5000/start-exam
Authorization: Bearer <your-jwt-token>
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check MongoDB service and connection string
2. **CORS Issues**: Ensure backend CORS is properly configured
3. **Token Expired**: Sign in again to get new token
4. **Port Already in Use**: Change port in configuration

### Debug Mode
Enable detailed logging by setting:
```javascript
// In server.js
mongoose.set('debug', true);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for robust backend solutions
- MongoDB for flexible database management
- All contributors and testers

---

**Note**: This project was created as an assignment for demonstrating full-stack web development skills with React, Node.js, and MongoDB.
