import FormData from 'form-data'; 

function CreateUser() {
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
    try{
    fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/adduser", {
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
        <input type="text" name="email" onChange={handleInputChange} />
      </label>
      <br />
      <label>
        First Name:
        <input type="text" name="first_name" onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="last_name" onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Confirm Password:
        <input type="password" name="confirmPassword" onChange={handleInputChange} />
      </label>
      <br />
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUser;
