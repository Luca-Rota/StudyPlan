'use strict';

const express = require('express');
const morgan = require('morgan');// logging middleware
const cors = require('cors');
const dao = require('./dao');// module for accessing the DB
const passport = require('passport');// auth middleware
const LocalStrategy = require('passport-local').Strategy;// username and password for login
const session = require('express-session');// enable sessions
const userDao = require('./user-dao');// module for accessing the users in the DB
const PORT = 3001;
const URL = '/api/';

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user) {
        return done(null, false, { message: 'Username e/o password non corretti.' });
      }
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
// set-up the middlewares
const app = express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Utente non autenticato.' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// Activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

app.post(URL + 'sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
        // display wrong login messages
      return res.status(401).json(info);
    }
     // success, perform the login
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
       // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete(URL + 'sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get(URL + 'sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: 'Utente non autenticato.' });;
  }
});

app.get(URL + 'courses', async (req, res) => {
  try {
    const courses = await dao.getCourses();
    res.status(200).json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Errore nel database.` });
  }

});

app.get(URL + 'studyPlan', isLoggedIn, async (req, res) => {
  try {
    const studyPlan = await dao.getStudyPlan(req.user.id)
    res.status(200).json(studyPlan);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Errore nel database.` });
  }

});

app.post(URL + 'createStudyPlan', isLoggedIn, async (req, res) => {

  try {
    const courses = await dao.getCourses();

    const studyPlan = req.body.piano;
    const studyTime = req.body.tipoPiano;

    const h = studyPlan.map(e => courses.some(el => el.codice === e)).filter(Boolean);
    if (h.length !== studyPlan.length) {
      return res.status(422).json({ error: "Uno o più codici inseriti nel piano di studi non sono corretti." });
    }

    const j = studyPlan.map(e => Object.assign({}, courses.find(el => el.codice === e)));

    const k = j.map(e => (!e.incompatibilità) ? false : ((e.incompatibilità.split(" ").map(el => ((studyPlan
      .some(item => item.codice === el)) ? true : false)).filter(Boolean).length) ? true : false)).filter(Boolean);
    if (k.length) {
      return res.status(422).json({ error: "Il piano di studi ha problemi di incompatibilità." });
    }

    const w = j.map(e => (!e.propedeuticità) ? true : j.find(el => el.codice === e.propedeuticità)).filter(elem => elem === undefined);
    if (w.length) {
      return res.status(422).json({ error: "Il piano di studi ha problemi di propedeuticità." });
    }

    const x = j.map(e => (!e.maxStudenti) ? true : ((parseInt(e.numStudenti) + 1) <= parseInt(e.maxStudenti)) ? true : false).filter(Boolean);
    if (x.length !== studyPlan.length) {
      return res.status(422).json({ error: "Uno o più corsi inseriti hanno già raggiunto la capienza massima." });
    }

    if (studyTime !== "part-time" && studyTime !== "full-time") {
      return res.status(422).json({ error: "Tipo di piano di studi scelto non valido." });
    }

    const y = j.reduce((acc, obj) => (acc + parseInt(obj.crediti)), 0);
    if ((studyTime === "part-time" && (y < 20 || y > 40)) || (studyTime === "full-time" && (y < 60 || y > 80))) {
      return res.status(422).json({ error: "Il piano di studi non rientra nelle soglie di crediti consentite." });
    }

    try {
      const studyPlanOld = await dao.getStudyPlan(req.user.id);

      const oldCourses = studyPlanOld.map(e => Object.assign({}, courses.find(el => el.codice === e)))
        .filter(x => !studyPlan.includes(x)).map(elem => ({ code: elem.codice, value: (parseInt(elem.codice.numStudenti) - 1) }));
      const newCourses = studyPlan.map(e => Object.assign({}, courses.find(el => el.codice === e)))
        .filter(x => !studyPlanOld.includes(x)).map(elem => ({ code: elem.codice, value: ((parseInt(elem.numStudenti)) + 1) }));;
      const coursesToUp = newCourses.concat(oldCourses);

      try {
        await dao.create_study_plan(studyPlan, coursesToUp, req.user.id);
        res.status(201).end();
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Errore nel database: creazione del piano di studi.` });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: `Errore nel database: lettura tabella Piano di Studi.` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Errore nel database: lettura tabella Corsi.` });
  }
});

app.post(URL + 'deleteStudyPlan', isLoggedIn, async (req, res) => {

  try {
    const courses = await dao.getCourses();

    try {
      const studyPlan = await dao.getStudyPlan(req.user.id)

      const coursesToUp = studyPlan.map(c => ({ code: c.codice, value: (parseInt(courses.find(e => e.codice === c.codice).numStudenti) - 1) }));

      try {
        await dao.delete_study_plan(coursesToUp, req.user.id);
        res.status(201).end();
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Errore nel database: eliminazione del piano di studi.` });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: `Errore nel database: lettura tabella Piano di Studi.` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Errore nel database: lettura tabella Corsi.` });
  }
});