import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function CreateUser() {
  const handleSubmit = (event) => {
    event.preventDefault();  

    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("first_name", event.target.first_name.value);
    formData.append("last_name", event.target.last_name.value);
    formData.append("password", event.target.password.value);
    formData.append("confirmPassword", event.target.confirmPassword.value);

    fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/adduser", {
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
        // error={Boolean(true)}
        // helperText={"XX"}
      />
      <TextField
        label="First Name"
        type="text"
        name="first_name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        type="text"
        name="last_name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="outlined" color="primary" style={{ width: "45%" }}>
        Create Account
    </Button>
    </Box>
  </form>
  );
}

export default CreateUser;
