var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

/* CREATE a new task (prevents blank tasks) */
router.post('/create', function (req, res, next) {
  const task = req.body.task ? req.body.task.trim() : '';
  
  // Prevent blank tasks from being submitted
  if (!task) {
    return res.redirect('/');
  }

  try {
    req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
      if (err) {
        console.error('Error adding todo:', err);
        return res.status(500).send('Error adding todo');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

/* EDIT a task description */
router.post('/edit', function (req, res, next) {
  const { id } = req.body;
  const task = req.body.task ? req.body.task.trim() : '';

  // Prevent saving a blank task description
  if (!task) {
    return res.redirect('/');
  }

  try {
    req.db.query('UPDATE todos SET task = ? WHERE id = ?;', [task, id], (err, results) => {
      if (err) {
        console.error('Error updating todo:', err);
        return res.status(500).send('Error updating todo');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Error updating todo');
  }
});

/* TOGGLE completion state ("Not Completed" <-> "Completed") */
router.post('/toggle', function (req, res, next) {
  const { id, completed } = req.body;
  // Flip the current state (assuming 0 = Not Completed, 1 = Completed)
  const newStatus = completed == 1 ? 0 : 1;

  try {
    req.db.query('UPDATE todos SET completed = ? WHERE id = ?;', [newStatus, id], (err, results) => {
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).send('Error updating status');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).send('Error updating status');
  }
});

/* DELETE a task */
router.post('/delete', function (req, res, next) {
  const { id } = req.body;
  try {
    req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Error deleting todo');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo');
  }
});

module.exports = router;
