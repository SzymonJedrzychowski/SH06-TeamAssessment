import { useState } from "react";
import { Buffer } from 'buffer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = (props) =>  {
  const setInformData = props.dialogData.setInformData;
  const resetInformData = props.dialogData.resetInformData;
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedString = Buffer.from(email + ":" + password).toString('base64');
    fetch(process.env.REACT_APP_API_LINK + "authenticate", {
      method: "POST",
      headers: new Headers({ "Authorization": "Basic " + encodedString })
    })
    .then((response) => response.json())
    .then(
      (json) => {
        if (json.message === "Success") {
          console.log("Success: ");
          localStorage.setItem('token', json.data.token);
          setInformData([true, () => {resetInformData(); navigate("/partner")}, "Success", 
          ["You have successfully logged in!", "You will be redirected to the partner page."]]);
        } else {
          console.log("Not success: ");
          localStorage.removeItem('token');
          if (json.message === "Incorrect credentials.") {
            setInformData([true, () => {resetInformData(); navigate("/login")}, "Error",
            ["Incorrect credentials.", "Please try again."]]);           
          }
        }
      })
      .catch(
        (e) => {
            console.log(e.message)
        }
      )
    };     

  return (
    <form onSubmit={handleSubmit} >
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
