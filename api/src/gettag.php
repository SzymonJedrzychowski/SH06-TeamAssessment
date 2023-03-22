<?php
/**
 * Get Tags endpoint
 * @author Joshua Bell
 */

class getTag extends Endpoint
{
    private $data;

    public function __construct()
    {

            $db = new Database("db/database.db");
            $sql =  "SELECT tag_id, tag_name FROM tag";
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
