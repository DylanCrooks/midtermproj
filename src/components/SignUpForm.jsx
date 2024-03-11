import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

function SignUpForm(props) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [show, setShow] = useState(false); // State for modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setFormData({
      ...formData, // Spread operator preserves existing data
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // 1. Extract user data from formData
    const { username, name, email, password } = formData; 
    fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((responseData) => {
            props.onLoginSuccess(responseData); // Pass data to parent component
          })
        .catch((error) => {
          // Handle errors
        });
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Signup
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignUpForm;
