import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";

function SignUp() {  
    const handleSubmit = (event) => {
      event.preventDefault();  

      const formData = new FormData();
      formData.append("subscriber_email", event.target.subscriber_email.value);

      fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/addsubscriber", {
        method: "POST",
        body: formData,
      })    
      .then((response) => response.json())
      .then(
        (json) => console.log(json)
      )
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
      <ListItem style={{justifyContent: "center", textAlign: "center"}}>
        <h1>Sign up for the newsletter now!</h1>
      </ListItem>
      <TextField
        label="Email"
        type="text"
        name="subscriber_email"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <br/>
      <Button type="submit" variant="outlined" color="primary" style={{width: "50%"}}>
        Join us
      </Button>
      </Box>
  </form>
    );
  }
  
  export default SignUp;