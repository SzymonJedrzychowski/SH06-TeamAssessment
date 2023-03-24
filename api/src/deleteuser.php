<?php
/**
 * Delete User endpoint
 * @author Joshua Bell
 */

class deleteuser extends Verify {
//    private $data;

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

            if ($tokenData->auth != "3") {
                throw new BadRequest("Only admin can delete a user.");
            }
            $params = [
                "user_id" => $data["userId"]
            ];


            // Start the transaction.
            $db->beginTransaction();

            try {

            // delete the organisation from database
                $sql = "UPDATE user SET authorisation = 0 WHERE user_id = :user_id";

                $this->setSQLCommand($sql);
                $this->setSQLParams([
                    'user_id' => $params['user_id'],
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