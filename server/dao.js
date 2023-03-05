'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('database.db', (err) => {
  if (err) {
    throw err;
  }
});

function getCourses() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Corsi';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((c) => ({
        codice: c.codice, nome: c.nome, crediti: c.crediti, numStudenti: c.numStudenti,
        maxStudenti: c.maxStudenti, incompatibilità: c.incompatibilità, propedeuticità: c.propedeuticità
      }));
      resolve(courses);
    });
  });
};

function getStudyPlan(user_id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT codiceCorso FROM PianoDiStudi Where idUtente=?';
    db.all(sql, [user_id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const studyPlan = rows.map((c) => ({ codice: c.codiceCorso }));
      resolve(studyPlan);
    });
  });
};

function addCourse(code, user_id) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO PianoDiStudi(codiceCorso, idUtente) VALUES(?,?)';
    db.run(sql, [code, user_id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve("ok");
    });
  });
};

function updateCourse(code, newValue) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Corsi SET numStudenti=? WHERE codice = ?`;
    db.run(sql, [newValue, code], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

function deleteAllCourses(user_id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM PianoDiStudi WHERE idUtente=?';
    db.run(sql, [user_id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

function create_study_plan(studyPlan, courses, user_id) {
  return new Promise((resolve, reject) => {
    deleteAllCourses(user_id).then(() =>
      Promise.all(studyPlan.map(c => addCourse(c, user_id))).then(() =>
        Promise.all(courses.map(c => updateCourse(c.code, c.value))).then(() => resolve())))
      .catch(err => reject(err));
  });
}

function delete_study_plan(courses, user_id) {
  return new Promise((resolve, reject) => {
    deleteAllCourses(user_id).then(() =>
      Promise.all(courses.map(c => updateCourse(c.code, c.value))).then(() => resolve()))
      .catch(err => reject(err));
  })
}

module.exports = { getCourses, getStudyPlan, create_study_plan, delete_study_plan };