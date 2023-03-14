<?php

/**
 * Responsible for handling /postitemtags endpoint.
 *
 * This class reads and validates received parameters
 * and changes tags on newsletter item.
 *
 * @author Szymon Jedrzychowski
 */
class PostItemTags extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /postitemtags endpoint.
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
        $this->validateParameters();

        // Validate the JWT.
        $tokenData = parent::validateToken();

        if(!in_array($tokenData->auth, ["2", "3"])){
            throw new BadRequest("Only editor and admin can submit tags for newsletter_item.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            
            // Initialise the SQL command and parameters to insert new data to database.
            $sql = "DELETE FROM item_tag WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Initialise the SQL command and parameters to modify data of newsletter items.
            $array = json_decode($_POST["item_tags"]);

            if($array == null){
                throw new BadRequest("Incorrect format of newsletter_items array.");
            }

            $in = join(',', array_fill(0, count($array), '(?, ?)'));
            $sql = "INSERT INTO item_tag (item_id, tag_id) VALUES ". $in;

            $this->setSQLCommand($sql);
            $temp = array();
            foreach($array as &$item){
                array_push($temp, $_POST['item_id']);
                array_push($temp, $item);
            }
            $this->setSQLParams(
                $temp
            );

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
        $requiredParameters = array('item_id', 'item_tags');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /postitemtags endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => 'int',
            'item_tags' => 'string'
        ];
    }
}
