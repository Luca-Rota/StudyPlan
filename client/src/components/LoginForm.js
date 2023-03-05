import { Form, Button, Alert, Container, Row } from 'react-bootstrap';
import { useState } from 'react';

function MyLoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errForm, setErrForm] = useState('');

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrForm(() => '');
    const credentials = { username, password };

    let valid = true;
    if (!validateEmail(username)) {
      valid = false;
      setErrForm(() => 'Email non valida.');
    }
    else if (password === '') {
      valid = false;
      setErrForm(() => 'Password non può essere vuota.');
    }
    if (valid) {
      props.login(credentials);
    }
  };

  return (

    <Container className='mt-5'>
      {props.sideErr ? <Alert className='mt-3' variant='danger' onClose={() => props.setSideErr(() => '')} dismissible>{JSON.stringify(props.sideErr)}</Alert> : false}
      <Row>
        <h2>Login</h2>
        <Form className="mt-3" onSubmit={handleSubmit}>
          {errForm ? <Alert variant='danger' onClose={() => setErrForm('')} dismissible> {errForm} </Alert> : false}
          <Form.Group className="mb-3" controlId='username'>
            <Form.Label> Email </Form.Label>
            <Form.Control type='input' placeholder="Inserisci email" value={username} onChange={ev => setUsername(() => ev.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId='password'>
            <Form.Label> Password </Form.Label>
            <Form.Control type='password' placeholder="Inserisci password" value={password} onChange={ev => setPassword(() => ev.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary" className="m-3">Login</Button>
        </Form>
      </Row>
    </Container>

  );
}

export default MyLoginForm;