import React from 'react';

function SignInButton(props) {
  return (
    <button type="button" onClick={props.onClick}>
      Sign In
    </button>
  );
}

export default SignInButton;