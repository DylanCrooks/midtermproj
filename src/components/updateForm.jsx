import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

function UpdateForm(props) {
  const [formData, setFormData] = useState({
    new_username: '',
    new_name: '',
    new_profile_picture: '',
  });

  const handleClose = () => {
    props.handleClose(); // Call the prop function to close the modal
  };

  const handleChange = (event) => {
    setFormData({
      ...formData, // Spread operator preserves existing data
      [event.target.id]: event.target.value,
    });
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Assuming you store the token in localStorage
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Handle errors here, e.g., display an error message to the user
      console.error('Error updating profile:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('Profile update response:', data);

    // Handle successful update here, e.g., close the modal, display a success message
    props.handleClose(); // Close the modal on successful update
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header>
          <Modal.Title>Update Profile Y</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">New Username:</label>
            <input
              type="text"
              id="new_username"
              value={formData.new_username}
              onChange={handleChange}
            />
            <label htmlFor="name">New Name:</label>
            <input
              type="text"
              id="new_name"
              value={formData.new_name}
              onChange={handleChange}
            />
            <label htmlFor="profile_picture">New Profile Picture Link:</label>
            <input
              type="text"
              id="new_profile_picture"
              value={formData.new_profile_picture}
              onChange={handleChange}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateForm;
