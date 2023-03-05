import { Course } from './course';

const APIURL = new URL('http://localhost:3001/api/');

function getCourses() {
  return new Promise((resolve, reject) => {
    fetch(new URL('courses', APIURL), {
      method: 'GET',
    }).then((response) => {
      if (response.ok) {
        response.json().then((coursesJson) => {
          const courses = coursesJson.map(c => Object.assign(new Course(), {codice: c.codice, nome: c.nome, 
            crediti: c.crediti, numStudenti: c.numStudenti, maxStudenti: ((c.maxStudenti) ? c.maxStudenti : "NaN"), 
            incompatibilità: ((c.incompatibilità) ? c.incompatibilità.split(" ") : ""), 
            propedeuticità: ((c.propedeuticità) ? c.propedeuticità : "Nessuna")}));
          resolve(courses);
        });
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

function getStudyPlan() {
  return new Promise((resolve, reject) => {
    fetch(new URL('studyPlan', APIURL), {
      method: 'GET',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        response.json().then((studyPlanJson) => {
          const studyPlan = studyPlanJson;
          resolve(studyPlan);
        });
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

function createStudyPlan(studyPlan, studyTime) {
  return new Promise((resolve, reject) => {
    fetch(new URL('createStudyPlan', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({piano: studyPlan, tipoPiano: studyTime}),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message) })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

function deleteStudyPlan(courses) {
  return new Promise((resolve, reject) => {
    fetch(new URL('deleteStudyPlan', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ corsi: courses }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message) })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

function logIn(credentials) {
  return new Promise((resolve, reject) => {
    fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((response) => {
      if (response.ok) {
        const user = response.json();
        resolve(user);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

async function logOut() {
  await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    fetch(new URL('sessions/current', APIURL), {
      method: 'GET',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        const userInfo = response.json(); 
        resolve(userInfo);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Impossibile analizzare la risposta del server." }) });
      }
    }).catch(() => { reject({ error: "Impossibile comunicare con il server." }) });
  });
}

const API = { getCourses, getStudyPlan, createStudyPlan, deleteStudyPlan, logIn, logOut, getUserInfo };
export default API;