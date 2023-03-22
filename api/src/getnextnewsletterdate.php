<?php
/**
 * Get next newsletter date endpoint
 * @author Joshua Bell
 */

class getNextNewsletterDate extends Endpoint
{
    private $data;

    public function __construct()
    {
            $db = new Database("db/database.db");
            $sql = "SELECT date from next_newsletter_date";
            $params = [];

            $this->validateRequestMethod("GET");

            $this->data = $db->executeSQL($sql, $params);


    }
    public function getData()
    {

        return json_encode($this->data);
    }
}

?>
