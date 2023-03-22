<?php
/**
 * Edit User endpoint
 * @author Joshua Bell
 */
class updateUser extends Verify
{

    public function __construct()
    {

        $db = new Database("db/database.db");

        // ensure request method is POST
        $this->validateRequestMethod("POST");

        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

        $this->checkAvailableParams($this->getAvailableParams());

//             Validate the JWT.
        $tokenData = parent::validateToken();

//             Throw exception if user is not admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only admin can update a user.");
        }

        $params = [
            "authorisation" => $data["authorisation"],
            "user_id" => $data["userId"]
        ];

        // Start the transaction.
        $db->beginTransaction();

        try {
            // update the editor with the new data
            $sql = "UPDATE user SET authorisation = :authorisation WHERE user_id = :user_id";

            $this->setSQLCommand($sql);

            $this->setSQLParams([
                'authorisation' => $params['authorisation'],
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

}


