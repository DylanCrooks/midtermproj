import React, { useState, useEffect } from 'react';
import SignUpForm from './components/SignUpForm.jsx'; 
import LoginForm from './components/LoginForm.jsx'; 
import UpdateForm from './components/updateForm.jsx';
import DeleteForm from './components/DeleteForm.jsx'; 
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Add email state variable
  const [profilePicture, setProfilePicture] = useState('');
  const [openUpdateForm, setOpenUpdateForm] = useState(false); // State flag for UpdateForm
  const [openDeleteAccountForm, setOpenDeleteAccountForm] = useState(false); // State flag for UpdateForm
  // State variables for modal visibility
  const handleLogout = () => {
    // Logic to handle logout, e.g., clear local storage and set isLoggedIn to false
    localStorage.removeItem('access_token');
    setIsLoggedIn(false); 
  }
  const handleOpenDeleteAccountForm = () => {
    setOpenDeleteAccountForm(true);
  };
  const handleCloseDeleteAccountForm = () => {
    setOpenDeleteAccountForm(false);
  };

  const handleOpenUpdateForm = () => {
    setOpenUpdateForm(true); // Set flag to open UpdateForm
  };

  const handleCloseUpdateForm = () => {
    setOpenUpdateForm(false); // Reset flag to close UpdateForm
  };


  /*async function fetchUserDetails(accessToken) {
    try {
      const response = await fetch('/verify-JWT-return-userdata', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Invalid token or user data not found: ${response.status}`);
      }
  
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error; // Re-throw the error for handling in the useEffect hook
    }
  } */

  const handleLoginSuccess = (responseData) => {
    // Assuming responseData contains access_token (or success indicator)
    if (responseData.access_token) {
      localStorage.setItem('access_token', responseData.access_token);
      setIsLoggedIn(true);
      setUsername(responseData.username);
      setName(responseData.name); // Assuming the backend sends the name in the response
      setProfilePicture(responseData.profile_picture); // Assuming profile picture URL is in the response
      setEmail(responseData.email);
    }
  };

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">CSS? Who's that?</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Left-side navigation links (add them here if needed) */}
            <Nav className="me-auto"></Nav>
            <Nav>
              {!isLoggedIn && (
                <>
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                  <SignUpForm onLoginSuccess={handleLoginSuccess} />
                </>
              )}
              {isLoggedIn && (
                <>
                  {profilePicture && (
                    <img
                      src={profilePicture}
                      alt="Profile Picture"
                      className="profile-picture rounded-circle img-thumbnail"
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  )}
                  <NavDropdown title={username} id="basic-nav-dropdown">
                    <NavDropdown.Item as="button" onClick={handleOpenUpdateForm}>
                      Update Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    <NavDropdown.Item as="button" onClick={handleOpenDeleteAccountForm}>
                      Delete Account
                    </NavDropdown.Item>
                  </NavDropdown>
                  {/* UpdateForm rendered conditionally outside NavDropdown */}
                  {openUpdateForm && <UpdateForm show={openUpdateForm} handleClose={handleCloseUpdateForm} />}
                  {openDeleteAccountForm && <DeleteForm show={openDeleteAccountForm} handleClose={handleCloseDeleteAccountForm} />}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;