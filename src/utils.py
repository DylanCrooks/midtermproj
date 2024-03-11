import os
from fastapi import Request, Response, status
from pydantic import BaseModel, Field
def load_env_vars():
  """Loads environment variables from a .env file."""
  if os.path.exists(".env"):
    with open(".env") as f:
      for line in f:
        # Remove leading/trailing whitespace and split key-value pair
        key, value = line.strip().split("=")
        # Set the environment variable
        os.environ[key] = value

class UserSignup(BaseModel):
    username: str
    email: str
    password: str
    name: str


class UserModel(UserSignup):
    username: str
    email: str
    password: str
    name: str
    profile_picture: str = "https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png"
    userID: str | None


class UserLogin(BaseModel):
    """username: str, password: str"""
    username: str
    password: str
