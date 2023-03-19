import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateUser = (props) => {
  const setInformData = props.dialogData.setInformData;
  const resetInformData = props.dialogData.resetInformData;
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();  

    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("first_name", event.target.first_name.value);
    formData.append("last_name", event.target.last_name.value);
    formData.append("password", event.target.password.value);
    formData.append("confirm_password", event.target.confirm_password.value);

    fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/adduser", {
      method: "POST",
      body : formData,
    })
    .then((response) => response.json())
    .then(
      (json) => {
        if (json.message === "Success") {
          console.log("Success: ");
          setInformData([true, () => {resetInformData(); navigate("/login")}, "Success", 
          ["You have successfully created your account!", "Now you can log in."]]);
        } else {
          console.log("Not success: ");
           if (json.message === "email parameter required") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The email is required.", "Please try again."]]);
          }
          else if (json.message === "Email already exists") {
            setInformData([true, () => {resetInformData(); navigate("/login")}, "Error", 
            ["This email is already in use.", "Try logging in."]]);
          }
          else if (json.message === "Email is not valid") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["This email is not valid.", "Please enter a valid email."]]);
          }
          else if (json.message === "Domain does not exist") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error", 
            ["You are not allowed to create an account using this domain.", "Please use different one."]]);
          }
          else if (json.message === "first_name parameter required") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The first name is required.", "Please try again."]]);
          }
          else if (json.message === "last_name parameter required") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The last name is required.", "Please try again."]]);
          }
          else if (json.message === "password parameter required") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The password is required.", "Please try again."]]);
          }
          else if (json.message === "Password must be at least 8 characters long") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The password must be at least 8 characters long.", "Please try again."]]);
          }
          else if (json.message === "confirm_password parameter required") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error",
            ["The password confirmation is required.", "Please try again."]]);
          }
          else if (json.message === "Passwords do not match") {
            setInformData([true, () => {resetInformData(); navigate("/createaccount")}, "Error", 
            ["The passwords do not match.", "Please try again."]]);
          }
      }
    }
    )
    .catch(
      (e) => {
          console.log(e.message)
      }
    )
  };     

  return (
    

    <form onSubmit={handleSubmit}>
      <Box
        display="grid"
        width="45%"
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
              margin="none"
            />
          </Grid>
    
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              variant="outlined"
              fullWidth
              margin="none"
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