<?php
/**
 * Get Stats
 * @author Joshua Bell
 */
class getStats extends Verify
{
    private $data;

    public function __construct()
    {

        $db = new Database("db/database.db");

        if ($_SERVER["REQUEST_METHOD"] !== "GET" && $_SERVER["REQUEST_METHOD"] !== "POST") {
            throw new ClientException(
                "Invalid request method, please use GET OR POST"
            );
        }

        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

        //             Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

//             Validate the JWT.
        $tokenData = parent::validateToken();
//             Throw exception if user is not admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only admin can filter stats");
        }

        $params = [];

        $sql = "SELECT count(*) as 'count' from newsletter_item";

        if ($data["tagId"] != "") {
            $sql .= " JOIN item_tag on item_tag.item_id = newsletter_item.item_id WHERE tag_id = :tag";
            $params[":tag"] = $data["tagId"];
        }
        if ($data["userId"] != "" && $data["tagId"] != "") {
            $sql .= " AND user_id = :user";
            $params[":user"] = $data["userId"];
        }
        if ($data["userId"] != "" && $data["tagId"] === "") {
            $sql .= " WHERE user_id = :user";
            $params[":user"] = $data["userId"];
        }

        // Start the transaction.
        $db->beginTransaction();

     try {

         $this->data = $db->executeSQL($sql, $params);

         $this->setSQLCommand($sql);

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

    public function getData()
    {
        return json_encode($this->data, JSON_UNESCAPED_UNICODE);
    }
}

