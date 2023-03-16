import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function SignUp() {  
    const handleSubmit = (event) => {
      event.preventDefault();  

      const formData = new FormData();
      formData.append("subscriber_email", event.target.subscriber_email.value);

      fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/addsubscriber", {
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
        width="28%"
        margin="0 auto"
      >
      <TextField
        label="Email"
        type="text"
        name="subscriber_email"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="outlined" color="primary">
        Sign Up
      </Button>
      </Box>
  </form>
    );
  }
  
  export default SignUp;