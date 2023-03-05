import { Row, Alert, Accordion, Col, Container } from "react-bootstrap";
import { MyRemovedButton } from './UpdateButtons.js';
import { MyEditButtons, MyDeleteButton } from './TerminalButtons.js';
import '../App.css';

function MyStudyPlan(props) {

  return (

    <>

      <Row>
        <h2> Il tuo piano di studi </h2>
      </Row>
      <Row className='mt-2'>
        <h6>
          Hai scelto il piano: {props.user.pianoDiStudi}. Numero crediti: {(props.user.pianoDiStudi === 'full-time') ? '60-80' : '20-40'}.
        </h6>
      </Row>
      <Row>
        <h6>
          Totale crediti precedenti: {props.user.totaleCreditiPrec}. Crediti selezionati: {props.user.totaleCrediti}.
        </h6>
      </Row>
      <Row>
        {(props.sideErr) ? <Alert className='mt-2 mb-0' variant='danger'
          onClose={() => { props.setSideErr(() => ''); props.setErrParams(() => ''); }} dismissible>
          {props.sideErr} {(props.errParams) ?
            Object.values(props.errParams).map(elem => (Array.isArray(elem)) ? elem.map(el => el + '; ') : elem + ' ') : false}
        </Alert> : false}
      </Row>
      <Row className='mt-3 scrollable-div2 noBarChrome noBarFirefox'>
        <Accordion alwaysOpen >
          {(props.studyPlan.length) ? props.studyPlan.map((course) => {
            return <StudyPlanCard key={course.codice} course={course} setCourses={props.setCourses} courses={props.courses}
              setUser={props.setUser} setStudyPlan={props.setStudyPlan} setStartEdit={props.setStartEdit}
              setSideErr={props.setSideErr} setErrParams={props.setErrParams} studyPlan={props.studyPlan} />
          }) : false}
        </Accordion >
      </Row>
      <Row className='mt-4'>
        {(props.startEdit) ? <MyEditButtons Save={props.Save} Undo={props.Undo} /> : <MyDeleteButton Delete={props.Delete} />}
      </Row>
    </>

  );
}

function StudyPlanCard(props) {

  function findCourse(code) {
    return props.courses.find(element => element.codice === code).codice.trim();
  }

  return (

    <Accordion.Item eventKey={props.course.codice} >
      <Accordion.Header >
        <Container>
          <Row>
            <Col md={1}>
              <MyRemovedButton setCourses={props.setCourses} setStartEdit={props.setStartEdit}
                setUser={props.setUser} setStudyPlan={props.setStudyPlan} course={props.course}
                setSideErr={props.setSideErr} setErrParams={props.setErrParams} studyPlan={props.studyPlan} />
            </Col>
            <Col md={11}>
              <h6 className="ms-3 mt-1">{props.course.codice} - {props.course.nome}</h6>
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

export default MyStudyPlan;