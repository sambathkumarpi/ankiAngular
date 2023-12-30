
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());


// SQLite database setup
const db = new sqlite3.Database('app.db'); // Consider using a file-based database

// Function to check if a table exists (Promisified)
const tableExists = (tableName) => {
  return new Promise((resolve, reject) => {
    db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? true : false);
          }
        }
    );
  });
};

// Create tables if not exists (Async/Await)
const createTableIfNotExists = async (tableName, createTableQuery) => {
  try {
    const exists = await tableExists(tableName);
    if (!exists) {
      await db.run(createTableQuery);
    }
  } catch (error) {
    console.error(error);
  }
};

// Create tables
const createTables = async () => {
  await createTableIfNotExists('Subjects', 'CREATE TABLE Subjects ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  await createTableIfNotExists('DifficultyLevels', 'CREATE TABLE DifficultyLevels (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  await createTableIfNotExists('TestSessions', 'CREATE TABLE IF NOT EXISTS TestSessions (id INTEGER PRIMARY KEY AUTOINCREMENT, start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, end_time TIMESTAMP, subject_id INTEGER NOT NULL, FOREIGN KEY (subject_id) REFERENCES Subjects(id));');
  await createTableIfNotExists('Flashcards', 'CREATE TABLE Flashcards (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, subject_id INTEGER NOT NULL, difficulty_id INTEGER DEFAULT 1, FOREIGN KEY (subject_id) REFERENCES Subjects(id), FOREIGN KEY (difficulty_id) REFERENCES DifficultyLevels(id))');
  // INSERT INTO DifficultyLevels (name) VALUES ('Very Easy');
  // INSERT INTO DifficultyLevels (name) VALUES ('Easy');
  // INSERT INTO DifficultyLevels (name) VALUES ('Difficult');
  // INSERT INTO DifficultyLevels (name) VALUES ('Hard');
};

// Initialize tables
createTables();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Flashcards API',
      version: '1.0.0',
      description: 'API for managing flashcards',
    },
  },
  apis: ['app.js'], // Include your API file(s) here
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes here (e.g., GET, POST, PUT, DELETE for Subjects, DifficultyLevels, Flashcards)


/**
 * @swagger
 * /api/subjects/{subjectId}:
 *   get:
 *     summary: Get subjects
 *     description: Retrieve a specific subject by ID or all subjects if no ID is provided.
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         description: (Optional) ID of the subject
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the subject(s).
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Math
 *               - id: 2
 *                 name: Science
 */
app.get('/api/subjects/:subjectId?', (req, res) => {
  const subjectId = parseInt(req.params.subjectId, 10); // Convert to integer

  console.log(`Server is running on port subjectId` + subjectId);

  let sql = 'SELECT * FROM Subjects';

  const params = [];

  if (!isNaN(subjectId)) {
    sql += ' WHERE id = ?';
    params.push(subjectId);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});



/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Add a new subject or check if it already exists
 *     description: Add a new subject to the database if it doesn't exist. If it exists, return the existing subject.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Subject data
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful response with the existing or added subject.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         example:
 *           id: 1
 *           name: New Subject
 */
app.post('/api/subjects', (req, res) => {
  const { name } = req.body;

  // Validate input (add your own validation logic as needed)

  // Check if the subject already exists
  const selectSql = 'SELECT * FROM Subjects WHERE name = ?';
  db.get(selectSql, [name], (err, existingSubject) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (existingSubject) {
      // Subject already exists, return the existing subject
      res.status(200).json(existingSubject);
    } else {
      // Insert new subject into the database
      const insertSql = 'INSERT INTO Subjects (name) VALUES (?)';
      db.run(insertSql, [name], function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          // Fetch and return the added subject
          const newSubjectId = this.lastID;
          db.get(selectSql, [newSubjectId], (err, addedSubject) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json(addedSubject);
            }
          });
        }
      });
    }
  });
});

/**
 * @swagger
 * /api/subjects/{subjectId}:
 *   delete:
 *     summary: Delete a subject by ID
 *     description: Delete a specific subject by providing its ID.
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         description: ID of the subject to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subject deleted successfully.
 *       404:
 *         description: Subject not found.
 */
app.delete('/api/subjects/:subjectId', (req, res) => {
  const subjectId = parseInt(req.params.subjectId, 10); // Convert to integer

  console.log(`Deleting subject with ID: ${subjectId}`);

  if (isNaN(subjectId)) {
    res.status(400).json({ error: 'Invalid subject ID' });
    return;
  }

  const deleteSql = 'DELETE FROM Subjects WHERE id = ?';

  db.run(deleteSql, [subjectId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (this.changes === 0) {
      // No rows affected, subject not found
      res.status(404).json({ error: 'Subject not found' });
    } else {
      // Subject deleted successfully
      res.status(204).end();
    }
  });
});



/**
 * @swagger
 * /api/flashcards/{subjectId}:
 *   get:
 *     summary: Get flashcards by subject with difficulty level names
 *     description: Retrieve a list of flashcards based on a specific subject, including difficulty level names.
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         description: ID of the subject
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the list of flashcards for the specified subject and difficulty level names.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 question: What is the capital of France?
 *                 answer: Paris
 *                 subject_id: 2
 *                 difficulty_id: 1
 *                 difficulty_name: Easy
 *               - id: 3
 *                 question: What is the largest planet in our solar system?
 *                 answer: Jupiter
 *                 subject_id: 2
 *                 difficulty_id: 2
 *                 difficulty_name: Medium
 */
app.get('/api/flashcards/:subjectId', (req, res) => {
  const subjectId = req.params.subjectId;

  const sql = `
    SELECT Flashcards.id, Flashcards.question, Flashcards.answer, Flashcards.subject_id, Flashcards.difficulty_id, DifficultyLevels.name as difficulty_name
    FROM Flashcards
    LEFT JOIN DifficultyLevels ON Flashcards.difficulty_id = DifficultyLevels.id
    WHERE Flashcards.subject_id = ?
  `;

  db.all(sql, [subjectId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});

/**
 * @swagger
 * /api/flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     description: Create a new flashcard based on the provided subject ID and difficulty ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Flashcard data
 *         schema:
 *           type: object
 *           properties:
 *             question:
 *               type: string
 *               description: The question for the flashcard
 *             answer:
 *               type: string
 *               description: The answer for the flashcard
 *             subject_id:
 *               type: integer
 *               description: The ID of the subject for the flashcard
 *             difficulty_id:
 *               type: integer
 *               description: The ID of the difficulty level for the flashcard
 *     responses:
 *       201:
 *         description: Flashcard created successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               question: Sample question
 *               answer: Sample answer
 *               subject_id: 1
 *               difficulty_id: 1
 */
app.post('/api/flashcards', (req, res) => {
  const { question, answer, subject_id, difficulty_id } = req.body;
  console.log(`flashcards `+ req.body);
  // Validate input (add your own validation logic as needed)
  if (!question || !answer || !subject_id || difficulty_id === undefined || difficulty_id === null) {
    return res.status(400).json({ error: 'Invalid input. Please provide question, answer, subject_id, and difficulty_id.' });
  }

  // Insert new flashcard into the database
  const insertSql = 'INSERT INTO Flashcards (question, answer, subject_id, difficulty_id) VALUES (?, ?, ?, ?)';
  db.run(insertSql, [question, answer, subject_id, difficulty_id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Fetch and return the added flashcard
      const selectSql = 'SELECT * FROM Flashcards WHERE id = ?';
      const newFlashcardId = this.lastID;
      db.get(selectSql, [newFlashcardId], (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json(row);
        }
      });
    }
  });
});



/**
 * @swagger
 * /api/flashcards/{id}/difficulty:
 *   put:
 *     summary: Update difficulty level of a flashcard
 *     description: Update the difficulty level of a flashcard based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the flashcard
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: Update data
 *         schema:
 *           type: object
 *           properties:
 *             difficulty_id:
 *               type: integer
 *               description: The ID of the new difficulty level
 *     responses:
 *       200:
 *         description: Flashcard difficulty updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Difficulty updated successfully.
 */
app.put('/api/flashcards/:id/difficulty', (req, res) => {
  const flashcardId = req.params.id;
  const { difficulty_id } = req.body;

  // Validate input
  if (!difficulty_id || typeof difficulty_id !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid difficulty_id.' });
  }

  // Update the difficulty level in the database
  const updateSql = 'UPDATE Flashcards SET difficulty_id = ? WHERE id = ?';
  db.run(updateSql, [difficulty_id, flashcardId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Flashcard not found.' });
    } else {
      res.status(200).json({ message: 'Difficulty updated successfully.' });
    }
  });
});



/**
 * @swagger
 * /test-sessions:
 *   get:
 *     summary: Get all test sessions
 *     description: Retrieve a list of all test sessions.
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
app.get('/test-sessions', (req, res) => {
  db.all('SELECT * FROM TestSessions', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(rows);
    }
  });
});

/**
 * @swagger
 * /test-sessions:
 *   post:
 *     summary: Create a new test session
 *     description: Create a new test session with the specified parameters.
 *     parameters:
 *       - in: body
 *         name: testSession
 *         description: The test session to create.
 *         schema:
 *           type: object
 *           required:
 *             - subject_id
 *           properties:
 *             subject_id:
 *               type: integer
 *               description: The ID of the subject for the test session.
 *     responses:
 *       201:
 *         description: Test session created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/test-sessions', (req, res) => {
  const { subject_id } = req.body;

  if (!subject_id) {
    res.status(400).json({ error: 'Bad request. Missing required parameter: subject_id.' });
    return;
  }

  const insertQuery = 'INSERT INTO TestSessions (subject_id) VALUES (?)';

  db.run(insertQuery, [subject_id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const newTestId = this.lastID;
      res.status(201).json({ id: newTestId, subject_id });
    }
  });
});


/**
 * @swagger
 * /test-sessions/{id}:
 *   put:
 *     summary: Update the end time of a test session
 *     description: Update the end time of a test session with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the test session to update.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: updateData
 *         description: The data to update in the test session.
 *         schema:
 *           type: object
 *           required:
 *             - end_time
 *           properties:
 *             end_time:
 *               type: string
 *               format: date-time
 *               description: The new end time for the test session.
 *     responses:
 *       200:
 *         description: Test session updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Test session not found
 *       500:
 *         description: Internal server error
 */
app.put('/test-sessions/:id', (req, res) => {
  const testSessionId = req.params.id;
  const { end_time } = req.body;

  if (!end_time) {
    res.status(400).json({ error: 'Bad request. Missing required parameter: end_time.' });
    return;
  }

  const updateQuery = 'UPDATE TestSessions SET end_time = ? WHERE id = ?';

  db.run(updateQuery, [end_time, testSessionId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (this.changes === 0) {
      // No rows were affected, indicating that the test session with the given ID was not found
      res.status(404).json({ error: 'Test session not found' });
    } else {
      res.status(200).json({ message: 'Test session updated successfully' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
