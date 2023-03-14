<?php
/**
 * Responsible for handling /adduser endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class AddUser extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /adduser endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */

    /* TODO
    1. add domain verification (@domain.com of partners)
    2. add user uniqueness (email)
    3. add header to main page after login
    4. 
     */
    public  function __construct()
    { 
        // Connect to the database.
        $db = new Database("db/database.db");
        // Check if correct request method was used.
        $this->validateRequestMethod("POST");
        // Validate the parameters.
        $this->validateParameters();

        $sql = "SELECT organisation_domain FROM organisation;";
        $this->setSQLCommand($sql);
        $this->setSQLParams();

        $domains = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
        $user_organisation = $_POST["organisation_id"];
        $user_domain = explode("@", $user_organisation);
        $user_domain = $user_domain[1];

        $this->setData(array(
            "message" => "Debugging",
            "domains" => $domains,
            "user_domain" => $user_domain
        ));
        // log user_domain to file
        $myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
        fwrite($myfile, $user_domain);
        fclose($myfile);

        //check if organisation_domain exists in the organisation table
        if (!in_array($user_domain, $domains)) {
            throw new ClientErrorException("Invalid organisation domain", 400);
        }
        
        $this->setData(array(
            "message" => "Success",
            "domains" => $domains
        ));



        // Initialise the SQL command and parameters to insert new data to database.
        $sql = "INSERT INTO user (email, first_name, last_name, password, organisation_id, authorisation) 
        VALUES (:email, :first_name, :last_name, :password, :organisation_id, :authorisation)";

        $this->setSQLCommand($sql);
        $this->setSQLParams(array(
            ":email" => $_POST["email"],
            ":first_name" => $_POST["first_name"],
            ":last_name" => $_POST["last_name"],
            ":password" => $this->encodePassword($_POST["password"]),
            ":organisation_id" => $_POST["organisation_id"],
            ":authorisation" => 1
        ));

        $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        // Set the response data.
        $this->setData(array(
            "message" => "Success",
        ));
    }
    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {   
        // Check if required parameters are present.
        $requiredParameters = array("email", "first_name","last_name","organisation_id","password","confirmPassword");
        foreach ($requiredParameters as &$value) {
            if (!filter_has_var(INPUT_POST, $value) || empty($_POST[$value]) ) {
                throw new ClientErrorException($value . " parameter required", 400);
            }
        }
        // Check if email is valid.
        if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
            throw new ClientErrorException("Invalid email", 400);
        }

        // Check if password is valid.
        if (strlen($_POST["password"]) < 8) {
            throw new ClientErrorException("Password must be at least 8 characters long", 400);
        }

        // Check if password and confirmed password match.
        if ($_POST["password"] != $_POST["confirmPassword"]) {
            throw new ClientErrorException("Passwords do not match", 400);
        }
    }

    function encodePassword($password)
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }
}
?>