<?php
/**
 * Get Users endpoint
 * @author Joshua Bell
 */

class getUsers extends Endpoint
{
    private $data;

    public function __construct()
    {

            $db = new Database("db/database.db");
            $sql = "SELECT user_id, first_name, last_name, authorisation from user WHERE authorisation in (1,2,3)";
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
