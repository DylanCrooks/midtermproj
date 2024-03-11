

//
const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLogin = (data) => {
    // Send login data to backend using fetch or axios
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          setIsLoggedIn(true);
          setUsername(data.username); // Assuming backend provides username
          // ... (potentially fetch profile picture)
          navigate('/');
        } else {
          // Handle login failure
        }
      })
      .catch((error) => {
        // Handle errors
      });
  };
  const handleSignupSubmit = (event) => {
    event.preventDefault();

    const formData = {
      username: event.target.username.value,
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    localStorage.setItem('username')
    // Send signup data to backend using fetch
    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.access_token) {
          localStorage.setItem('access_token', responseData.access_token);
          setIsLoggedIn(true);
          setUsername(responseData.username);
          setProfilePicture(responseData.profile_picture); // Assuming profile picture URL is in the response
          // ... (potentially redirect to a different page)
        } else {
          // Handle signup failure (e.g., display error message)
        }
      })
      .catch((error) => {
        // Handle errors
      });
  
  };