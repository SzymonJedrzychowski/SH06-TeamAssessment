<?php

/**
 * Responsible for handling /removetag endpoint.
 *
 * This class is used to remove a tag.
 *
 * @author Szymon Jedrzychowski
 */
class RemoveTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /removetag endpoint.
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
            throw new BadRequest("Only admin can remove tags.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Delete the tag from item_tag.
            $sql = "DELETE FROM item_tag WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_id' => $_POST['tag_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // End step 1.

            // Step 2. Delete the tag.
            $sql = "DELETE FROM tag WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);

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
        $requiredParameters = array('tag_id');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /removetag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'tag_id' => 'int'
        ];
    }
}
