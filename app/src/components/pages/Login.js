import { useState } from 'react';
import { Buffer } from 'buffer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handler for username value.
  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  // Handler for password value.
  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedString = Buffer.from(email + ":" + password).toString('base64');
    fetch("http://unn-w20027449.newnumyspace.co.uk/teamAssessment/api/authenticate", {
      method: "POST",
      headers: new Headers({ "Authorization": "Basic " + encodedString })
    })

      .then((response) => response.json())
      .then(
        (json) => {
          if (json.message === "Success") {
            console.log("Success: ");
            localStorage.setItem('token', json.data.token);
          } else {
            console.log("Not success: ");
            localStorage.removeItem('token');
          }
          console.log(json);
        })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" name="email" onChange={handleEmail} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" onChange={handlePassword} />
      </label>
      <br />

      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
