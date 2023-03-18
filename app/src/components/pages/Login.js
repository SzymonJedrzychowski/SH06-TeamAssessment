import { useState } from "react";
import { Buffer } from 'buffer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import AlertDialog from './AlertDialog';


function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setInformData = props.dialogData.setInformData;
  // const setAlertData = props.dialogData.setAlertData;
  const resetInformData = props.dialogData.resetInformData;

  // Handler for username value.
  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  // Handler for password value.
  const handlePassword = (event) => {
    setPassword(event.target.value);
  }
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedString = Buffer.from(email + ":" + password).toString('base64');
    fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/authenticate", {
      method: "POST",
      headers: new Headers({ "Authorization": "Basic " + encodedString })
    })
    .then((response) => response.json())
    .then(
      (json) => console.log(json)
    )
    dialogData.setInformData([true, () => {resetInformData(); navigate("/homepage")}, "Success", 
    ["You have successfully logged in! You will be redirected to the homepage."]]);
  };

  return (
    <form onSubmit={handleSubmit} alignItems="center">
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="30%"
      margin="0 auto"
      marginTop={"10vh"}
    >
    <ListItem style={{justifyContent: "center"}}>
      <h1>Log in</h1>
    </ListItem>
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
    <ListItem style={{fontSize: "small", justifyContent: "center"}}>
      <p style={{color: "gray", paddingRight:"0.5%"}}>Don't have an account yet? </p> 
      <p><RouterLink to="/createaccount">Sign up</RouterLink></p>
    </ListItem>

    <Button type="submit" variant="outlined" color="primary" style={{width: "50%"}}>
      Log in
    </Button>
    </Box>
  </form>
  );
}

export default Login;
