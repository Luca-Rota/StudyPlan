import { Container, Row, Accordion, Col } from "react-bootstrap";
import { MyAddedButton } from './UpdateButtons.js';
import '../App.css';

function MyCoursesList(props) {

  return (

    <Container className='mt-5' >
      <Row>
        <h2>Lista completa dei corsi</h2>
      </Row>
      <Row className='mt-3 scrollable-div noBarChrome noBarFirefox '>
        <Accordion alwaysOpen >
          {(props.courses) ? props.courses.map((course) => {
            return <CourseCard key={course.codice} course={course} setCourses={props.setCourses} studyPlan={props.studyPlan}
            setUser={props.setUser} setStudyPlan={props.setStudyPlan} setStartEdit={props.setStartEdit} user={props.user} 
            setSideErr={props.setSideErr} setErrParams={props.setErrParams} loggedIn={props.loggedIn} courses={props.courses} />
          }) : false}
        </Accordion>
      </Row>
    </Container>

  );
}

function CourseCard(props) {

  function findCourse(code) {
    return props.courses.find(element => element.codice === code).codice.trim();
  }
  
  return (
    
    <Accordion.Item eventKey={props.course.codice} >
      <Accordion.Header >
        <Container>
          <Row>
            <Col md={1}>
              {(props.loggedIn && props.user.pianoDiStudi) ?
                <MyAddedButton course={props.course} setCourses={props.setCourses} setStartEdit={props.setStartEdit}
                  setUser={props.setUser} setStudyPlan={props.setStudyPlan} studyPlan={props.studyPlan}
                  setSideErr={props.setSideErr} setErrParams={props.setErrParams} courses={props.courses} /> : false}
            </Col>
            <Col md={11}>
              <h6 className="ms-3 mt-1"> {props.course.codice} {" - "} {props.course.nome} </h6>
            </Col>
          </Row>
          <Row> - Crediti: {props.course.crediti} </Row>
          <Row> - Numero attuale studenti: {props.course.numStudenti} </Row>
          <Row> - Numero massimo studenti: {props.course.maxStudenti} </Row>
        </Container>
      </Accordion.Header>
      <Accordion.Body >
        <Row className="mx-2" >
          <Row> - Incompatibilità: {' '}
            {(!props.course.incompatibilità) ? "Nessuna" :
              (props.course.incompatibilità.map((el, i) => (i === (props.course.incompatibilità.length - 1)) ?
                (' ' + findCourse(el)) : (' ' + findCourse(el) + ',')))}
          </Row>
          <Row> - Propedeuticità: {props.course.propedeuticità} </Row>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
    
  );
}

export default MyCoursesList;

