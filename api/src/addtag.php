<?php

/**
 * Responsible for handling /addtag endpoint.
 *
 * This class is used to add new tags.
 *
 * @author Szymon Jedrzychowski
 */
class AddTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /addtag endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    public  function __construct()
    {
        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        // Validate the update parameters.
        $this->validateParameters();

        // Validate the JWT.
        $tokenData = parent::validateToken();

        // Throw exception if user is not admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only and admin can add tags.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Check if tag with given name already exists.
            $sql = "SELECT * FROM tag WHERE tag_name = :tag_name";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw exception if tag with given name exists.
            if (count($data) > 0) {
                throw new BadRequest("EM: Tag with given name already exists");
            }

            // End step 1.

            // Step 2. Insert new tag.
            $sql = "INSERT INTO tag (tag_name) VALUES (:tag_name)";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
            // End step 2.

            // Commit the transaction.
            $db->commitTransaction();

            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => null
            ));
        } catch (Exception $e) {
            $db->rollbackTransaction();
            throw $e;
        }
    }

    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {
        $requiredParameters = array('tag_name');
        $this->checkRequiredParameters($requiredParameters);

        //Throw exception if tag name is longer than 25 characters.
        if (strlen($_POST["tag_name"]) > 25) {
            throw new ClientErrorException("EM: Tag name cannot be longer than 25 characters.");
        }
        
        //Throw exception if tag name is 0 characters long.
        if (strlen($_POST["tag_name"]) == 0){
            throw new ClientErrorException("EM: Tag name needs to be at least one character long.");
        }

        //Throw exception if tag name starts or ends with space.
        if (strlen(trim($_POST["tag_name"])) == 0 || strlen(trim($_POST["tag_name"])) != strlen($_POST["tag_name"])){
            throw new ClientErrorException("EM: Tag name cannot start or end with a space.");
        }
    }

    /**
     * Set the array of available parameters for /addtag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return ['tag_name' => 'string'];
    }
}
