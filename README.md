# Simple Sign-up / Log in App
### Project Description:

This is a React web application that implements a basic user authentication system. Users can sign up, log in, update their profiles, and delete their accounts. Users can have a username, profile picture, name, and email address. 
Do note that relevant frontend code is in App.jsx, and in the components folder.
Backend is main.py 

### Technologies Used:

Frontend: React.js, React Bootstrap 
Backend: (FastAPI)
Authentication: JWT (JSON Web Token) 

### Features:

User Signup 
User Login
User Profile Update 
User Account Deletion 

### Known Issues:

Refresh Issue: Currently, refreshing the page results in the user being logged out. This requires implementing mechanisms to persist user authentication data across page refreshes (e.g., storing tokens in local storage or using cookies).
Missing CSS: The application currently lacks much CSS styling. 
Non-functional delete password and username input: The account deletion uses the JWT to authenticate account deletion. However, this is not good practice, and should require both password authentication as well as JWT authentication.
No message or reaction upon unsuccessful signup/login.
Delete Account modal's close button may not work (but can be closed by submitting invalid delete request, i.e empty string)
The code is ugly as hell, primarily due to my ignorance. A large contributor to this is the remnants of features I wished to implement, but eventually killed off because there wasn't time for it, such as using HTTPS. 
There are variables and constants that shouldn't be directly in the code, and instead present in a gitignore .env file. I did once have a function to do this, but after migrating projects (twice) to run from the mounting disordered code/file structure, it was too much of a strain to keep working with. This is why the github repo is private: it includes the database connection string.)


#### In depth: User Authentication

The user will sign up by clicking on a button that opens a modal on the frontend. Here, users can input their account information, including username, name, a URL pointing to their profile picture image, their email address, and their password. This will immediately log them in if their inputs are valid. If users already have an account, they can log in by also clicking on a button and uploading their information through a modal. Currently, the modals lack appropriate CSS styling. 
When users sign up, if they do not provide a link to a profile picture, they will receive a default profile picture instead.

![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/4c00f6da-ddd7-4aee-aa2f-70b1a5fda04c)

##### Signup Modal: 
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/fa04e1d3-31d3-429f-9bb9-6a4d092f394e)

##### Login Modal: 

![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/2016ce91-0676-4dd0-a432-e75298049593)

#### In depth: After login

After login, the page will update, and the login and signup buttons will be replaced by the profile picture and the user's name with a dropdown bar that allows users to update or delete their account, or log out. When users sign up, if they do not provide a link to a profile picture, they will receive a default profile picture instead. Currently, there is very sparse data validation on the backend, so users might be able to offer nonsensical or dangerous inputs. As mentioned before, account deletion only requires a valid JWT, which is a risk. The update feature also only requires a JWT, and doesn't need the user to log in beforehand, but won't update if there are no valid updates. The logout button only works from the frontend, deleting any JWTs from memory and setting isLoggedIn to false. Because I don't know how state management works on the frontend, their is likely security risks here. Additionally, it is good practice to wipe JWTs on the backend, but this is not implemented.

##### Logged-in view: 
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/04c9c864-3bff-45c1-8f33-0cef84e3956c)
##### Account dropdown:
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/94b65eaa-f505-4a75-a9dc-4124f4ba61b2)

##### Update modal: 
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/dab95379-d7ba-46b8-8725-58e51bd3386c)

##### Delete account modal: 
(Pardon the informal look - however, it's not necessary to make non-functional assets look nice. Deleting your account still works, it just doesn't need a username or password.)
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/683427be-3d68-4288-a72a-70ca089e8846)

##### Logged out view:
(same as before. given I'm not familiar with state management in JS, I've no idea whether there still exists certain variables that should have been wiped. As far as I'm aware, it's safe, but I'm not very far aware.)
![image](https://github.com/DylanCrooks/midtermproj/assets/157987346/8fd8144e-c011-4306-9499-a2fe680eb5dc)

##### Learning summary:
What I learned most from this project was the scale and complexity of web applications, as well as the KISS principle. Development should first build the bare necessities, and worry about adding new features later. This is the principle reason the app is so ugly, however, I'm actually still quite proud of it, given how much time I spent on it, even if much of that effort wasn't fruitful for this project, particularly learning about foreign API requests (from trying to implement google sign-in), and learning about HTTPS and SSL encryption.












