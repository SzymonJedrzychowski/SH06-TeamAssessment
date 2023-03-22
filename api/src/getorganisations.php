<?php
/**
 * Get organisations endpoint
 * @author Joshua Bell
 */

class getOrganisations extends Endpoint
{
    private $data;

    public function __construct()
    {


            $db = new Database("db/database.db");
            $sql =
                "SELECT organisation_id, organisation_name, organisation_domain from organisation";
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
