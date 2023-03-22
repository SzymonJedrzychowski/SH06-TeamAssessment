<?php
/**
 * Create Organisation endpoint
 */

class createOrganisation extends Verify {


    public function __construct() {

        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

//             Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

//             Validate the JWT.
        $tokenData = parent::validateToken();

//             Throw exception if user is not admin.
            if ($tokenData->auth != "3") {
                throw new BadRequest("Only admin can create an organisation.");
            }

        $params = [
            "name" => $data["organisation_name"],
            "domain" => $data["organisation_domain"],

        ];

        // Start the transaction.
        $db->beginTransaction();

        try {

            // insert the new organisation
            $sql = "INSERT INTO organisation (organisation_name, organisation_domain)
            VALUES (:name, :domain);";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'name' => $params['name'],
                'domain' => $params['domain']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

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


}
?>