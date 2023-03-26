<?php

/**
 * Responsible for handling /edittag endpoint.
 *
 * This class is used to edit the name of tag.
 *
 * @author Szymon Jedrzychowski
 */
class EditTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /edittag endpoint.
     *
     * @throws BadRequest           If request method is incorrect or non-authorised user used the endpoint.
     * @throws ClientErrorException If incorrect parameters were used.
     */
    public  function __construct()
    {
        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());
        $this->validateParameters();

        // Validate the JWT.
        $tokenData = parent::validateToken();

        // Throw exception if user is not admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only admin can edit tags.");
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
                throw new Exception("EM: Tag with given name already exists");
            }

            // End step 1.

            // Step 2. Update the tag_name.
            $sql = "UPDATE tag SET tag_name = :tag_name WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name'],
                'tag_id' => $_POST['tag_id']
            ]);

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw exception if no tags were updated.
            if ($data == 0) {
                throw new ClientErrorException("Problem with getting tag_id occurred.");
            }

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
        $requiredParameters = array('tag_id', 'tag_name');
        $this->checkRequiredParameters($requiredParameters);

        //Throw exception if tag name is longer than 25 characters.
        if (strlen($_POST["tag_name"]) > 25) {
            throw new ClientErrorException("EM: Tag name cannot be longer than 25 characters.");
        }

        //Throw exception if tag name is 0 characters long.
        if (strlen($_POST["tag_name"]) == 0) {
            throw new ClientErrorException("EM: Tag name needs to be at least one character long.");
        }

        //Throw exception if tag name starts or ends with space.
        if (strlen(trim($_POST["tag_name"])) == 0 || strlen(trim($_POST["tag_name"])) != strlen($_POST["tag_name"])) {
            throw new ClientErrorException("EM: Tag name cannot start or end with a space.");
        }
    }

    /**
     * Set the array of available parameters for /edittag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'tag_id' => 'int',
            'tag_name' => 'string'
        ];
    }
}
