# AI Interview Prep Platform

AI-Powered Interview Simulation, DSA Practice & ATS Resume Builder

An intelligent full-stack platform that helps users prepare for interviews through AI-generated questions, skill analysis, company-based DSA practice, feedback system, and ATS resume generation.

---

## Overview

AI Interview Prep Platform is an intelligent career preparation system that combines multiple AI-powered features into a single platform.

It helps users:

- Prepare for technical interviews
- Practice company-specific DSA questions
- Improve coding skills with AI feedback
- Build ATS-friendly resumes
- Learn required skills for any job role

---

## Problem Statement

Most interview preparation platforms only provide static questions and learning resources.

Candidates often struggle with:

- Unstructured interview preparation
- Lack of AI-based interview practice
- No instant coding feedback
- Company-specific DSA preparation
- ATS resume optimization
- Personalized learning roadmap

---

## Solution

AI Interview Prep Platform provides an end-to-end AI-powered preparation experience.

```
Learn → Practice → Analyze → Improve → Get Interview Ready
```

The platform uses AI to simulate real interviews, analyze coding solutions, generate resumes, and recommend skills based on job roles.

---

## Features

### AI Interview Generator

- Generate interview questions using AI
- Select:
  - Job Role
  - Difficulty Level
  - Number of Questions
- Real interview-like experience

### Skill Intelligence

Enter any job role and get:

- Required technical skills
- Learning roadmap
- Recommended technologies
- Career guidance

### Company-wise DSA Practice

Practice coding questions from top companies.

Supported companies include:

- Google
- Amazon
- Microsoft
- Adobe
- Meta
- Flipkart
- Infosys
- TCS

Features:

- Topic selection
- Difficulty selection
- Number of questions
- Coding editor
- Test cases
- AI evaluation

### AI Code Feedback

After solving a problem, AI analyzes:

- Code correctness
- Time Complexity
- Space Complexity
- Optimization
- Best approach
- Mistakes
- Suggestions for improvement

### ATS Resume Builder

Generate professional ATS-friendly resumes.

Features:

- Personal information
- Skills
- Projects
- Experience
- Education
- AI-generated summary
- PDF Download

### Authentication

- User Signup
- Login
- JWT Authentication
- Password Encryption using bcrypt
- Forgot Password
- OTP Verification
- Redis Session Management

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Redis

### AI Services

- Groq API
- Google Gemini API

### Authentication

- JWT
- bcrypt

### Other Libraries

- Multer
- PDF Parse
- Mammoth
- Swagger
- Express Validator

---

## Architecture

```
User
   │
   ▼
React Frontend
   │
   ▼
Express Backend
   │
 ┌─┴───────────────┐
 │                 │
 ▼                 ▼
MongoDB         Redis
 │                 │
 └───────┬─────────┘
         ▼
      AI Services
   (Groq + Gemini)
```

---

## Project Structure

```text
AI-Interview-Prep
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── backend
│   ├── controller
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── services
│   ├── config
│   └── index.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ai-interview-prep.git
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## Future Improvements

- Voice Interview
- Video Interview
- AI HR Interview
- Live Coding Interviews
- Leaderboard
- Mock Interview Recording
- Multi-language Code Execution
- Interview Analytics Dashboard

---

## Developed By

**Pranci Verma**

GitHub: https://github.com/pranciverma123-dev

---

## License

This project is developed for educational and portfolio purposes.
