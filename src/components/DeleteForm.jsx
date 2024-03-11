import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function DeleteForm(props) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [show, setShow] = useState(false); // State for modal visibility

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Assuming you store the token in localStorage
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Handle errors here, e.g., display an error message to the user
      console.error('Error deleting profile:', await response.text());
      return;
    }
    localStorage.removeItem('access_token'); // Clear access token
    props.handleClose(); // Close the main form
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header>
          <Modal.Title>Login Nonfunctional btw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">username:</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="password">password:</label>
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
            Delete Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteForm;
