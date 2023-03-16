<?php

/**
 * Responsible for handling /edittag endpoint.
 *
 * This class reads and validates received parameters
 * and changes name of tag in database.
 *
 * @author Szymon Jedrzychowski
 */
class EditTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /edittag endpoint.
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

        if (!in_array($tokenData->auth, ["2", "3"])) {
            throw new BadRequest("Only editor and admin can edit tags.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            $sql = "SELECT * FROM tag WHERE tag_name = :tag_name";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            if (count($data) > 0) {
                throw new Exception("EM: Tag with given name already exists");
            }

            $sql = "UPDATE tag SET tag_name = :tag_name WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name'],
                'tag_id' => $_POST['tag_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

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
