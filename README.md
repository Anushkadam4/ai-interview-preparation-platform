# AI Interview Preparation Platform

An AI-powered interview preparation platform that analyzes resumes, self-descriptions, and job descriptions to generate personalized interview reports and preparation strategies.

## Features

- Resume upload and PDF parsing
- AI-powered interview report generation
- Technical interview question generation
- Behavioral interview question generation
- Skill gap analysis
- Personalized preparation roadmap
- JWT-based authentication
- PDF report generation and download
- Secure MongoDB data storage

## Tech Stack

### Frontend
- React.js
- React Router
- SCSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer

### AI Integration
- Google Gemini API

## Project Structure

```text
Backend/
Frontend/
```

## Installation

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the Backend folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_api_key
```

## How It Works

1. User uploads a resume PDF or enters a self-description.
2. User provides a target job description.
3. Resume text is extracted and analyzed.
4. Gemini AI generates:
   - Match Score
   - Technical Questions
   - Behavioral Questions
   - Skill Gap Analysis
   - Preparation Plan
5. Report is stored in MongoDB.
6. User can download the generated report as a PDF.

## Future Improvements

- Interview chatbot
- Mock interview simulation
- Voice-based interview practice
- Performance analytics dashboard

## Author

Anushka Dam
