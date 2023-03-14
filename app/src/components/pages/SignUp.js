import FormData from 'form-data'; 

function SignUp() {
    const formData = new FormData();
  
    const handleEmail = (event) => {
        formData.append(event.target.name, event.target.value);
      //   for (var key of formData.entries()) {
      //     console.log(key[0] + ', ' + key[1]);
      // }
      };
    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(JSON.stringify(Object.fromEntries(formData)));
        try{
        fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/addsubscriber", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        })}
        catch(error){
          console.log(error);
        }
      };     
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" name="subscriber_email" onChange={handleEmail} />
        </label>
        <br />

        <button type="submit">Sign up</button>
      </form>
    );
  }
  
  export default SignUp;