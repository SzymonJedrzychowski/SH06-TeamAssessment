<?php

/**
 * Responsible for handling /editnewsletter endpoint.
 *
 * This class reads and validates received parameters
 * and adds changes the published newsletter.
 *
 * @author Szymon Jedrzychowski
 */
class EditNewsletter extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /editnewsletter endpoint.
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

        // Throw exception if user is not editor or admin.
        if(!in_array($tokenData->auth, ["2", "3"])){
            throw new BadRequest("Only editor and admin can modify the newsletter.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Update the content of the published newsletter.
            $sql = "UPDATE published_newsletter SET newsletter_content = :newsletter_content WHERE newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_id' => $_POST['newsletter_id'],
                'newsletter_content' => $_POST['newsletter_content']
            ]);

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Check if row with given newsletter_id was found.
            if($data == 0){
                throw new ClientErrorException("Problem with getting published_newsletter occured.");
            }

            // End step 1.

            // Step 2. Update values of published_newsletter_id for newsletter_items that were included in the newsletter before.
            $sql = "UPDATE newsletter_item SET published_newsletter_id = :value WHERE published_newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_id' => $_POST['newsletter_id'],
                'value' => null
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // End step 2.

            // Step 3. Update values of published_newsletter_id for newsletter_items that are included in the newsletter now.
            $array = json_decode($_POST["newsletter_items"]);

            if ($array == null) {
                throw new BadRequest("Incorrect format of newsletter_items array.");
            }

            $in = join(',', array_fill(0, count($array), '?'));
            $sql = "UPDATE newsletter_item SET published_newsletter_id = ? WHERE item_id IN (" . $in . ")";

            $this->setSQLCommand($sql);
            $this->setSQLParams(
                array_merge(array($_POST['newsletter_id']), $array)
            );

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw exception if there is a difference in updated items and length of array with items to update.
            if($data != count($array)){
                if(count($array) == 1 and $data[0] != null){
                    throw new ClientErrorException("Problem with updating newsletter_item occured.");
                }
            }

            // End step 3.

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
        $requiredParameters = array('newsletter_content', 'newsletter_items', 'newsletter_id');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /publishnewsletter endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'newsletter_content' => 'string',
            'newsletter_items' => 'string',
            'newsletter_id' => 'int'
        ];
    }
}
