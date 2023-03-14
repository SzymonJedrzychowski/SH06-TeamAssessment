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
    public  function __construct()
    { 
        // Connect to the database.
        $db = new Database("db/database.db");
        // Check if correct request method was used.
        $this->validateRequestMethod("POST");
        // Validate the parameters.
        $this->validateParameters();
        try{
            // Initialise the SQL command and parameters to get domain list from database.
            $sql = "SELECT organisation_domain FROM organisation;";
            $this->setSQLCommand($sql);

            // Get domain list from database.
            $domains = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
            
            // Get user domain from email.
            $user_email = $_POST["email"];
            $user_domain = substr($user_email, strpos($user_email, "@") + 1);

            // Add domains to array.
            $domain_list = array();
            for ($domain = 0; $domain < count($domains); $domain++) {
                array_push($domain_list, $domains[$domain]['organisation_domain']);
            }

            $domainFound = false;
            // Check if user domain is in domain list.
            foreach ($domain_list as $domain) {
                if ($domain == $user_domain) {
                    $domainFound = true;
                    break;
                }
            }
            if ($domainFound == false) {
                throw new ClientErrorException("Invalid domain", 400);
            }

            // Initialise the SQL command and parameters to get email list from database.
            $sql = "SELECT email FROM user;";
            $this->setSQLCommand($sql);

            // Get email list from database.
            $emails = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
            // Add emails to array.
            $email_list = array();
            for($email = 0; $email < count($emails); $email++){
                array_push($email_list, $emails[$email]['email']);
            }
            // Check if user email already exists.
            foreach($email_list as $email){
                if($email == $user_email){
                    throw new ClientErrorException("Email already exists", 400);
                }
            }
            
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
            // Insert new data to database.
            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Set the response data.
            $this->setData(array(
                "message" => "Success",
            ));
        }catch(Exception $e){
            throw new ClientErrorException($e->getMessage(), 400);
        }
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