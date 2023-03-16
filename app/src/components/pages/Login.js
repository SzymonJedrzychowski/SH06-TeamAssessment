import { useState } from "react";
import { Buffer } from 'buffer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handler for username value.
  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  // Handler for password value.
  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedString = Buffer.from(email + ":" + password).toString('base64');
    fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/authenticate", {
      method: "POST",
      headers: new Headers({ "Authorization": "Basic " + encodedString })
    })
    .then((response) => response.json())
    .then(
      (json) => {
        if (json.message === "Success") {
          console.log("Success: ");
          localStorage.setItem('token', json.data.token);
        } else {
          console.log("Not success: ");
          localStorage.removeItem('token');
        }
        console.log(json);
      })
  };

  return (
    <form onSubmit={handleSubmit} alignItems="center">
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="28%"
      margin="0 auto"
    >
    <TextField
      label="Email"
      type="text"
      name="email"
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleEmail}
    />    
    <TextField
      label="Password"
      type="password"
      name="password"
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handlePassword}
    />
    <Button type="submit" variant="outlined" color="primary">
      Log in
    </Button>
    </Box>
  </form>
  );
}

export default Login;
