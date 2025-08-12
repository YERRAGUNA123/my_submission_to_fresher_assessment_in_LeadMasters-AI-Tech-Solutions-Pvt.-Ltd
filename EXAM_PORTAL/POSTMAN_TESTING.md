# Postman Testing Guide - Exam Portal API

This guide provides step-by-step instructions for testing your exam portal backend using Postman.

## 🚀 Getting Started with Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import Collection**: Create new collection named "Exam Portal API"
3. **Set Base URL**: Use `http://localhost:5000` for local testing

## 📋 API Endpoints Testing

### 1. User Registration - POST /signup
**URL**: `http://localhost:5000/signup`
**Method**: POST
**Body** (raw JSON):
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```

**Expected Response**:
```json
{
  "message": "User registered successfully"
}
```

### 2. User Login - POST /signin
**URL**: `http://localhost:5000/signin`
**Method**: POST
**Body** (raw JSON):
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```

**Expected Response**:
```json
{
  "message": "Signin successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Start Exam - GET /start-exam
**URL**: `http://localhost:5000/start-exam`
**Method**: GET
**Headers**:
- `Authorization`: `Bearer <your-token-here>`

**Expected Response**:
```json
{
  "questions": [
    {
      "_id": "question-id",
      "questionText": "What is the capital city of Australia?",
      "options": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      "correctAnswer": "Canberra"
    }
  ],
  "timeleft": 120
}
```

### 4. Submit Exam - POST /submit-exam
**URL**: `http://localhost:5000/submit-exam
**Method**: POST
**Headers**:
- `Authorization`: `Bearer <your-token-here>`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "answers": {
    "question-id-1": "Canberra",
    "question-id-2": "Mars"
  }
}
```

**Expected Response**:
```json
{
  "message": "Exam submitted successfully"
}
```

### 5. Update Questions - PUT /update-exam-questions
**URL**: `http://localhost:5000/update-exam-questions`
**Method**: PUT
**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "questions": [
    {
      "questionText": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4"
    }
  ],
  "timeLimit": 120
}
```

**Expected Response**:
```json
{
  "message": "Exam questions updated successfully"
}
```

## 🔧 Postman Collection Setup

### Environment Variables
Create Postman environment with:
- `base_url`: `http://localhost:5000`
- `auth_token`: (leave empty, will be filled after login)

### Collection Structure
```
Exam Portal API
├── 1. User Registration
├── 2. User Login
├── 3. Start Exam
├── 4. Submit Exam
└── 5. Update Questions
```

## 🧪 Testing Workflow

1. **Test Registration**: Use POST /signup
2. **Test Login**: Use POST /signin and save token
3. **Test Exam Start**: Use GET /start-exam with token
4. **Test Exam Submission**: Use POST /submit-exam with answers
5. **Test Question Updates**: Use PUT /update-exam-questions

## 📊 Common Testing Scenarios

### Error Testing
- **Invalid credentials**: Test with wrong username/password
- **Missing token**: Test /start-exam without Authorization header
- **Invalid token**: Test with malformed JWT token
- **Empty answers**: Test /submit-exam with empty answers object

### Edge Cases
- **Long questions**: Test with very long question text
- **Special characters**: Test questions with special characters
- **Empty options**: Test with empty options array
- **Time limit**: Test with different time limits

## 🎯 Quick Testing Commands

### Using curl (alternative to Postman)
```bash
# Registration
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Login
curl -X POST http://localhost:5000/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Start exam (replace TOKEN)
curl -X GET http://localhost:5000/start-exam \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Submit exam
curl -X POST http://localhost:5000/submit-exam \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"answers":{"question-id":"answer"}}'
```

## ✅ Testing Checklist
- [ ] User registration works
- [ ] User login returns valid token
- [ ] Start exam returns questions
- [ ] Submit exam saves answers
- [ ] Update questions changes exam content
- [ ] Error handling works correctly
- [ ] Token authentication works
