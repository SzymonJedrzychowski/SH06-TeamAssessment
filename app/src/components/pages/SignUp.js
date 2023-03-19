import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = (props) => {  
  const setInformData = props.dialogData.setInformData;
  const resetInformData = props.dialogData.resetInformData;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();  

    const formData = new FormData();
    formData.append("subscriber_email", event.target.subscriber_email.value);

    fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/addsubscriber", {
      method: "POST",
      body: formData,
    })    
    .then((response) => response.json())
    .then(
      (json) => {
        if (json.message === "Success") {
          console.log("Success: ");
          setInformData([true, () => {resetInformData(); navigate("/homepage")}, "Success", 
          ["You have successfully subscribed to the newsletter!"]]);
        } else {
          console.log("Not success: ");
          if(json.message === "Email already exists") {
            setInformData([true, () => {resetInformData(); navigate("/signup")}, "Error",
            ["Email already signed up.", "Please try again."]]);
          }
          else  {
            setInformData([true, () => {resetInformData(); navigate("/signup")}, "Error",
            ["The email is not valid.", "Please try again."]]);
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