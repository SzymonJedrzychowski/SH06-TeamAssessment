<?php
/**
 * Edit Organisation endpoint
 * @author Joshua Bell
 */

class updateOrganisation extends Verify {

    public function __construct() {

            $db = new Database("db/database.db");

            // ensure request method is POST
            $this->validateRequestMethod("POST");

            $request_body = file_get_contents('php://input');
            $data = json_decode($request_body, true);

            //             Check if correct params were provided.
            $this->checkAvailableParams($this->getAvailableParams());

//             Validate the JWT.
            $tokenData = parent::validateToken();
//             Throw exception if user is not admin.
            if ($tokenData->auth != "3") {
                throw new BadRequest("Only admin can update an organisation.");
            }

                $params = [
                    "organisation_name" => $data["organisation_name"],
                    "organisation_domain" => $data["organisation_domain"],
                    "organisation_id" => $data["organisation_id"]
                ];



            // Start the transaction.
            $db->beginTransaction();

            try {

                // update the editor with the new data
                $sql = "UPDATE organisation SET organisation_name = :organisation_name,
                        organisation_domain = :organisation_domain WHERE organisation_id = :organisation_id;";

                $this->setSQLCommand($sql);

                $this->setSQLParams([
                    'organisation_name' => $params['organisation_name'],
                    'organisation_domain' => $params['organisation_domain'],
                    'organisation_id' => $params['organisation_id'],

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


