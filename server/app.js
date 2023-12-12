// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

// Initialize the app
const app = express();

app.use(cors());

// Use body-parser middleware to handle POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Open a database handle
let db = new sqlite3.Database('./anki.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  db.run('CREATE TABLE IF NOT EXISTS flashcards(id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, tag TEXT)', function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log('Flashcards table created successfully.');
  });  
  console.log('Connected to the SQlite database.');
});

// Initialize an array to store the flashcards in memory
let flashcards = [];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flashcard API with Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./app.js'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// /**
//  * @swagger
//  * /flashcards/memory:
//  *   get:
//  *     summary: Retrieve a list of flashcards from memory
//  *     responses:
//  *       200:
//  *         description: A list of flashcards from memory
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   question:
//  *                     type: string
//  *                   answer:
//  *                     type: string
//  */
// app.get('/flashcards/memory', (req, res) => {
//     res.json(flashcards);
// });

/**
 * @swagger
 * /flashcards/database:
 *   get:
 *     summary: Retrieve a list of flashcards from database
 *     responses:
 *       200:
 *         description: A list of flashcards from database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 */
app.get('/flashcards/database', (req, res) => {
  db.all('SELECT * FROM flashcards', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /flashcards/tags:
 *   get:
 *     summary: Retrieve a list of flashcards from database
 *     responses:
 *       200:
 *         description: A list of flashcards from database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tag:
 *                     type: string
 */
app.get('/flashcards/tags', (req, res) => {
  console.log("---------------- is called /tag")
  db.all('SELECT DISTINCT tag FROM flashcards', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});



/**
 * @swagger
 * /flashcards:
 *   post:
 *     summary: Add a new flashcard to memory and database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created flashcard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *                 tag:
 *                   type: string
 */
app.post('/flashcards', (req, res) => {
  let newFlashcard = {
    question: req.body.question,
    answer: req.body.answer,
    tag: req.body.tag
  };
  flashcards.push(newFlashcard);
  db.run(`INSERT INTO flashcards(question, answer, tag) VALUES(?, ?, ?)`, [newFlashcard.question, newFlashcard.answer, newFlashcard.tag], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    console.log(newFlashcard)
    res.json(newFlashcard);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
