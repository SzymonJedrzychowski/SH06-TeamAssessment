<?php
/**
 * Update Next Newsletter Date endpoint
 * @author Joshua Bell
 */

class updateNextNewsletterDate extends Verify {


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
                throw new BadRequest("Only admin can create an organisation.");
            }

            $params = [
                "date" => $data["date"],
            ];


            // Start the transaction.
            $db->beginTransaction();

            try {

                // update the editor with the new data
            $sql = "UPDATE next_newsletter_date SET date = :date";

                $this->setSQLCommand($sql);

                $this->setSQLParams([
                    'date' => $params['date'],
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
