# University Feedback Hub - Backend API

RESTful API service for the University Feedback Hub application, built with Node.js and Express.

## Features

- JWT Authentication
- Role-based Access Control
- File Upload Support
- MongoDB Integration
- API Rate Limiting
- Input Validation
- Error Handling

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for Authentication
- Multer for File Uploads
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [your-backend-repo-url]
cd [repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/feedback_hub
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

The API will be available at `https://pr-01.onrender.com`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Feedback
- GET /api/feedback - Get all feedback
- POST /api/feedback - Create new feedback
- PUT /api/feedback/:id - Update feedback
- DELETE /api/feedback/:id - Delete feedback

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Project Structure

```
server/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── TempUploads/    # Temporary file storage
└── server.js       # Entry point
```

## Error Handling

The API uses a centralized error handling mechanism. All errors are formatted as:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 