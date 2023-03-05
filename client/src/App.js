import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MyNavbar from './components/Navbar.js';
import MyCoursesList from './components/CoursesList.js';
import MyLoginForm from './components/LoginForm';
import MyStudyPlanSection from './components/StudyPlanSection';
import define_states from './defineStates.js';
import { Course } from './course';
import API from './API';


function App() {

  return (

    <Router>
      <App2 />
    </Router>

  );
}

function App2() {

  const [studyPlan, setStudyPlan] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [startEdit, setStartEdit] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [initLoadCourses, setInitLoadCourses] = useState(true);
  const [initLoadPlan, setInitLoadPlan] = useState(true);
  const [initLoadLog, setInitLoadLog] = useState(true);
  const [err, setErr] = useState(false);
  const [sideErr, setSideErr] = useState(false);
  const [errParams, setErrParams] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials).then(user => {
      setLoggedIn(() => true);
      setUser(() => user);
      setSideErr(() => '');
      setDirty(() => true);
      navigate('/');
    })
      .catch((e) => { handlerErrors(e) });
  }

  const doLogOut = () => {
    API.logOut().then(() => {
      setLoggedIn(() => false);
      setUser(() => {});
      setStudyPlan(() => []);
      navigate('/');
    }).catch((e) => { handlerErrors(e) });
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(() => true);
        setUser(() => user);
      } catch (err) {
        if (loggedIn) {
          handlerErrors(err);
        }
      }
    };
    checkAuth();
    setInitLoadLog(() => false);
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      API.getCourses().then((cs) => {
        setCourses(() => cs.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
        setErr(() => false);
      }).catch((e) => { handlerErrors(e) });
      setInitLoadCourses(() => false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && dirty) {
      API.getCourses().then((cs) => {
        setCourses(() => cs.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
        API.getStudyPlan().then((sp) => {
          const plan = sp.map(elem => Object.assign(new Course(), cs.find(el => el.codice === elem.codice)));
          setStudyPlan(() => plan.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
          const credit = plan.reduce((acc, obj) => (acc + obj.crediti), 0);
          const studyTime = (credit >= 20 && credit <= 40) ? "part-time" : ((credit >= 60 && credit <= 80) ? "full-time" : "");
          setUser(us => Object.assign({}, us, { totaleCrediti: credit, pianoDiStudi: studyTime, totaleCreditiPrec: credit }));
          if (!credit) {
            setStartEdit(() => true);
          }
          if (sp.length) {
            const coursesMark = cs.map(c => (Object.assign(new Course(), c, { status: define_states(c, plan) })));
            setCourses(() => coursesMark.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
          }
          setDirty(() => false);
          setErr(() => false);
          setInitLoadPlan(() => false);
        }).catch((e) => { handlerErrors(e) });
        setInitLoadCourses(() => false);
      }).catch((e) => { handlerErrors(e) });
    }
  }, [dirty, loggedIn]);

  useEffect(() => {
    if (loggedIn && !dirty) {
      if (user.pianoDiStudi !== '') {
        const coursesMark = courses.map(c => (Object.assign(new Course(), c, { status: define_states(c, studyPlan) })));
        setCourses(() => coursesMark.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
        const plan = studyPlan.map(elem => Object.assign(new Course(), courses.find(el => el.codice === elem.codice)));
        setStudyPlan(() => plan.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)));
      }
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      const timeId = setTimeout(() => {
        setSuccess(() => false);
      }, 3000)
      return () => {
        clearTimeout(timeId)
      }
    }
  }, [success]);

  function handlerErrors(e) {
    if (e.error === undefined) {
      setErr(() => e.message);
    } else {
      setErr(() => e.error);
    }
  }

  function Save() {
    if (user.pianoDiStudi === "part-time" && (user.totaleCrediti >= 20 && user.totaleCrediti <= 40) ||
      user.pianoDiStudi === "full-time" && (user.totaleCrediti >= 60 && user.totaleCrediti <= 80)) {
      API.createStudyPlan(studyPlan.map(e => e.codice), user.pianoDiStudi).then(() => {
        setDirty(() => true);
        setInitLoadCourses(() => true);
        setSuccess(() => true);
        setInitLoadPlan(() => true);
        setStartEdit(() => false);
      }).catch(err => handlerErrors(err));
    } else {
      console.log(user.totaleCrediti);
      setSideErr(() => {
        if ((user.pianoDiStudi === "part-time" && user.totaleCrediti < 20) ||
          (user.pianoDiStudi === "full-time" && user.totaleCrediti < 60)) {
          return "Numero crediti selezionati sotto la soglia minima."
        } else {
          return "Numero crediti selezionati sopra la soglia massima."
        }
      });
    }
  }

  function Delete() {
    API.deleteStudyPlan().then(() => {
      setDirty(() => true);
      setInitLoadCourses(() => true);
      setInitLoadPlan(() => true);
      setSuccess(() => true);
    }).catch(err => handlerErrors(err));
  }

  function Undo() {
    setSideErr(() => '');
    setDirty(() => true);
    setStartEdit(() => false);
  }

  function MyLayout() {

    return (
      <>
        <Container>
          <Row>
            <MyNavbar user={user} loggedIn={loggedIn} logout={doLogOut} />
          </Row>
        </Container>
        <Container fluid className='main'>
          <Row className="vheight-100 bg-light">
            {(!err) ? false :
              <Row>
                <Col md={{ span: 8, offset: 2 }}>
                  <Alert key="danger" variant="danger" className='mt-3 mb-0' onClose={() => setErr(() => '')} dismissible>
                    {err}
                  </Alert>
                </Col>
              </Row>}
            <Row>
              <Col md={6} >
                {(initLoadCourses) ?
                  <Alert key="warning" variant="warning" className='mt-5'> Loading... </Alert> :
                  <MyCoursesList courses={courses} studyPlan={studyPlan} loggedIn={loggedIn} 
                    setUser={setUser} setStudyPlan={setStudyPlan} setCourses={setCourses} user={user}
                    setSideErr={setSideErr} setErrParams={setErrParams} setStartEdit={setStartEdit} />}
              </Col>
              <Col md={6}>
                <Container className='mt-5'>
                  <Outlet />
                </Container>
              </Col>
            </Row>
          </Row>
        </Container>
      </>

    );
  }

  return (

    <>
      <Routes>
        <Route path="/" element={<MyLayout />} >
          <Route index element={(initLoadLog) ? <Alert key="warning" variant="warning" className='mt-5'> Loading... </Alert> :
            ((loggedIn) ? <Navigate to="home-page-logged-in" /> : <Navigate to="home-page" />)} />
          <Route path="home-page-logged-in" element={(!loggedIn) ? <Navigate to='/' /> :
            <MyStudyPlanSection user={user} setUser={setUser} setDirty={setDirty} startEdit={startEdit} Save={Save}
              setCourses={setCourses} Undo={Undo} initLoadPlan={initLoadPlan} courses={courses} success={success} 
              setSideErr={setSideErr} setErrParams={setErrParams} setStartEdit={setStartEdit} setSuccess={setSuccess}
              sideErr={sideErr} errParams={errParams} studyPlan={studyPlan} Delete={Delete} setStudyPlan={setStudyPlan} />} />
          <Route path="home-page" element={loggedIn ? <Navigate to='/' /> :
            <MyLoginForm login={doLogIn} setSideErr={setSideErr} sideErr={sideErr} />} />
        </Route>
      </Routes>
    </>

  );
}

export default App;