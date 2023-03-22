<?php
/**
 * Delete Organisation endpoint
 * @author Joshua Bell
 */

class deleteOrganisation extends Verify {
//    private $data;

    public function __construct() {

            // Connect to the database.
            $db = new Database("db/database.db");

            // Check if correct request method was used.
            $this->validateRequestMethod("DELETE");

            $request_body = file_get_contents('php://input');
            $data = json_decode($request_body, true);

//             Check if correct params were provided.
            $this->checkAvailableParams($this->getAvailableParams());

//             Validate the JWT.
            $tokenData = parent::validateToken();

            if ($tokenData->auth != "3") {
                throw new BadRequest("Only admin can delete an organisation.");
            }
            $params = [
                "organisation_id" => $data["organisation_id"]
            ];


            // Start the transaction.
            $db->beginTransaction();

            try {

            // delete the organisation from database
            $sql = "DELETE FROM organisation WHERE organisation_id = :organisation_id;";

                $this->setSQLCommand($sql);
                $this->setSQLParams([
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

//    public function getData() {
//        return json_encode($this->data);
//    }
}