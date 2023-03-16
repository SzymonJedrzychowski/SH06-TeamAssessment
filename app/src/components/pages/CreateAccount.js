import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";
import { Grid } from "@mui/material";

function CreateUser() {
  const handleSubmit = (event) => {
    event.preventDefault();  

    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("first_name", event.target.first_name.value);
    formData.append("last_name", event.target.last_name.value);
    formData.append("password", event.target.password.value);
    formData.append("confirmPassword", event.target.confirmPassword.value);

    fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/adduser", {
      method: "POST",
      body : formData,
    })
    .then((response) => response.json())
    .then(
      (json) => console.log(json)
    )
  };     

  return (
    

    <form onSubmit={handleSubmit} alignItems="center">
      <Box
        display="grid"
        width="50%"
        margin="0 auto"
        marginTop={"8vh"}
      >
        <ListItem style={{justifyContent: "center", textAlign: "center"}}>
          <h1>Create your partner account!</h1>
        </ListItem>
    
        <TextField
          label="Email"
          type="text"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
        />
    
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              type="text"
              name="first_name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              type="text"
              name="last_name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              fullWidth
              margin="0"
            />
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              variant="outlined"
              fullWidth
              margin="0"
            />
          </Grid>
        </Grid>
    
        <Button type="submit" variant="outlined" color="primary" style={{ width: "45%", marginTop: "5%", justifySelf: "center" }}>
          Create Account
        </Button>
      </Box>
    </form>
    

  );
}

export default CreateUser;
