const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3100;

app.use(express.json());
app.use(cors());

// Middleware for handling invalid JSON in requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ message: "Invalid JSON in request body" });
  } else {
    next();
  }
});

// Endpoint to serve quiz questions
app.get("/quiz", (req, res) => {
  // Read questions from the JSON file
  const questions = require("./questions.json");
  res.json(questions);
});

// Endpoint to receive and grade quiz answers
app.post("/submit-quiz", (req, res) => {
  const answers = req.body.answers;
  const questions = require("./questions.json");

  // Calculate the score
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correctAnswer) {
      score++;
    }
  }

  // Provide feedback
  const feedback = questions.map((q, index) => ({
    question: q.question,
    correctAnswer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
  }));

  res.json({ score, feedback });
});

// Error handling middleware for handling 404 Not Found errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware for handling other unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
