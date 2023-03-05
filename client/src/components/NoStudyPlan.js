import { Button, Col, Container, Row } from "react-bootstrap";

function MyNoStudyPlan(props) {

  return (

    <Container>
      <Row>
        <h2> Benvenuto {props.user?.name}! Inizia a creare il tuo piano di studi </h2>
      </Row>
      <Row className='mt-5'>
        <Col md={{ span: 4, offset: 2 }}>
          <Button variant="success" onClick={() => props.setUser((us) => ({ ...us, pianoDiStudi: 'part-time' }))}>Inizia part-time</Button>
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={() => props.setUser((us) => ({ ...us, pianoDiStudi: 'full-time' }))}> Inizia full-time</Button>
        </Col>
      </Row>
    </Container>

  );
}

export default MyNoStudyPlan;