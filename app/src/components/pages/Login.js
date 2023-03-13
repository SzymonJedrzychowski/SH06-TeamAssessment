import FormData from 'form-data'; 

function Login() {
  const formData = new FormData();

  const handleInputChange = (event) => {
    formData.append(event.target.name, event.target.value);
  //   for (var key of formData.entries()) {
  //     console.log(key[0] + ', ' + key[1]);
  // }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(JSON.stringify(Object.fromEntries(formData)));
    fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })

      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };     
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" name="email" onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" onChange={handleInputChange} />
      </label>
      <br />
      
      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
