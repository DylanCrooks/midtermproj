import pydantic
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2AuthorizationCodeBearer
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Request, Body, Response, status, responses
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPAuthorizationCredentials
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from starlette.responses import RedirectResponse
import random
from google.auth.transport import requests
from google.oauth2 import id_token
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import bcrypt
from frontend.src.utils import UserModel, UserLogin, UserSignup
import uuid

# database username: dccrooks78 database password: A5KqhM5qyzv5Xyjv
# this is NOT mongodb account username and password - that is login w/ google. 
connection_string = 'mongodb+srv://dccrooks78:A5KqhM5qyzv5Xyjv@cluster0.gzisc9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(connection_string)
JWT_SECRET_KEY = "4doorsmorewhores"

# Select the database and collection
db = client['Cluster0']
users = db['users']

app = FastAPI()
                                            #app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend origin
    allow_credentials=True,  # Optional, allow cookies if needed
    allow_methods=["*"],  # Allow all methods (or specify allowed methods)
    allow_headers=["*"],  # Allow all headers (or specify allowed headers)
)
router = APIRouter(prefix="/profile")
app.include_router(router)
"""
    username: DylanC
    email: dccrooks78@gmail.com
    password: stinky
    name: Dylan
    profile_picture: str = "https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png"
    userID: 
"""

if __name__ == '__main__':
    uvicorn.run("main:app", port=8000, host='127.0.0.1', reload = True, )
                #ssl_keyfile=r"C:\Users\dccro\Desktop\MiscProjects\midterm2024spring\key.pem", 
                #ssl_certfile=r"C:\Users\dccro\Desktop\MiscProjects\midterm2024spring\cert.pem")

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

#TODO: figure out if we need to make signup not return a token, because tokenUrl is "/login"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@app.post("/signup")
async def signup(user_signup: UserSignup):
    # TODO: check if username or email has been taken already
    # Hash password before storing
    hashed_password = bcrypt.hashpw(user_signup.password.encode(), bcrypt.gensalt())
    user_signup.password = hashed_password
    user = UserModel(
        username=user_signup.username,
        email=user_signup.email,
        password=user_signup.password,
        name=user_signup.name,
        userID=generate_user_id()
    )
    # Create user in database
    create_user(user.userID, user.email, user.name, user.username, user.password, user.profile_picture)
    return RedirectResponse(url="/login")

@app.post("/login")
async def login(user_data: UserLogin):
    """Logs in a user and returns an access token."""
    # Find user by username
    user = find_user("username",user_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    stupid_var_assignment: str
    stupid_var_assignment =  user['password']
    # Verify password using bcrypt
    if not bcrypt.checkpw(user_data.password.encode('utf-8'), stupid_var_assignment.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate JWT token (without sensitive information)
    access_token = create_jwt(user["userID"])
    return {"access_token": access_token, 
            "profile_picture": user['profile_picture'], 
            "username":user['username'], 
            "name":user['name'],
            "email":user['email']}

#
#
# FUCKING REMEMBER TO SEND JWT TOKENS AS PART AS HEADER, TOKEN BEARER <TOKEN> 
#
#




class UpdateProfileRequest(BaseModel):
    new_username: str #| None = None
    new_name: str #| None = None
    new_profile_picture: str | None = None


# TODO: make it better. currently, doesn't update the frontend. must refresh page and use new details to log in.

@app.put("/update")
async def update_profile(request: UpdateProfileRequest, token: str = Depends(oauth2_scheme)):
    verified_jwt = verify_jwt_token(token, JWT_SECRET_KEY)
    userID = verified_jwt['sub']
    
    updates = {}
    # Check each field and add it to the updates dictionary only if a value is provided
    if request.new_name and request.new_name != "":
        updates["name"] = request.new_name
    if request.new_username and request.new_username != "":
        updates["username"] = request.new_username
    if request.new_profile_picture and request.new_profile_picture != "":
        updates["profile_picture"] = request.new_profile_picture


    if updates:  # Only update if there are actual changes (not empty strings)
        users.update_one({"userID": userID}, {"$set": updates})
    else:
        # Handle the case where no valid updates were provided (optional)
        raise HTTPException(status_code=400, detail="No valid update fields provided")

    return {"message": "Profile update request submitted successfully!"}
#
# TODO: make sure the update shit works
#
# then, endpoint for deleting account. Then figure out frontend.
# 

@app.post("/testdelete")
async def testshit(token: str = Depends(oauth2_scheme)):
    try:
        verified_jwt = verify_jwt_token(token, JWT_SECRET_KEY)
        print(verified_jwt)
        user_id = verified_jwt['sub']
        print(user_id)
        return user_id
    except jwt.DecodeError:
        return Response(status_code=401, content={"error": "Invalid JWT token"})
    except Exception as e:
        print("Unexpected error:", e)
        return Response(status_code=500, content={"error": "Internal server error"})

@app.delete("/delete-account")
async def delete_account(token: str = Depends(oauth2_scheme)):
    # Verify JWT token and get user information
    print(token)
    verified_jwt = verify_jwt_token(token, JWT_SECRET_KEY)
    user_id = verified_jwt['sub']
    deleted_count = users.delete_one({"userID": user_id})
    

    if deleted_count.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    #TODO (optional): revoke tokens (would need to implement token blacklist and also store recently issued JWT tokens)

    return {"message": "Account deleted successfully"}


"""
@app.get("/verify-JWT-return-userdata")
async def verify_JWT_return_userdata(token: str = Depends(oauth2_scheme)):
    verified_jwt = verify_jwt_token(token, JWT_SECRET_KEY)
    user_id = verified_jwt['sub']
    user = find_user("userID",user_id)
    return {"profile_picture": user['profile_picture'], 
            "username":user['username'], 
            "name":user['name'],
            "email":user['email']}
"""


def verify_jwt_token(token, secret_key):
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.DecodeError as e:
        raise HTTPException(status_code=401, detail="Invalid JWT token")


def create_user(userid: str , email: str, name: str, username: str, 
                hashed_password: bytes, profile_picture="https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png"):
    user = {'userID': userid, 'email': email, 'name': name,'profile_picture':profile_picture, 'username':username, 'password' : hashed_password}
    users.insert_one(user)

    

def create_jwt(user_id: str) -> str:
    # Define the expiration time for the token (e.g., 30 minutes from now)
    expiration_time = datetime.utcnow() + timedelta(minutes=180)

    # Define the payload for the token
    payload = {
        "sub": user_id,
        "exp": expiration_time,
    }

    # Create and sign the token
    jwt_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

    return jwt_token
def generate_user_id():
  """Generates a unique User ID using UUID."""
  return str(uuid.uuid4())

def find_user(search_key, search_value):
  """Finds a user in the database by either ID or username."""
  if search_key == "userID":
    user = users.find_one({"userID": search_value})
    
  elif search_key == "username":
    user = users.find_one({"username": search_value})
  else:
    raise ValueError("Invalid search key. Must be 'userID' or 'username'")
  print(user)
  return user