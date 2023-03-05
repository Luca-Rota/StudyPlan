import { Button, Col } from 'react-bootstrap';

function MyEditButtons(props) {

  return (

    <>
      <Col md={{ span: 2, offset: 4 }}>
        <Button className='mb-3' variant="danger" onClick={() => props.Undo()}> Annulla </Button>
      </Col>
      <Col md={2}>
        <Button className='mb-3' variant="success" onClick={() => props.Save()}> Salva </Button>
      </Col>
    </>

  );
}

function MyDeleteButton(props) {

  return (

    <Col md={{ span: 3, offset: 5 }}>
      <Button variant="danger" onClick={() => props.Delete()}> Elimina </Button>
    </Col>

  );
}

export { MyEditButtons, MyDeleteButton };