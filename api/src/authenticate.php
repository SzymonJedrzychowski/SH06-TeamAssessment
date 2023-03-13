<?php

use FirebaseJWT\JWT;
use FirebaseJWT\Key;

/**
 * Responsible for handling /authenticate endpoint.
 *
 * This class is responsible for checking if the token is still valid and returning name of current user.
 *
 * @author Mikolaj Furmanczak
 */
class Authenticate extends Endpoint
{
    /**
     * @var array $decoded Array containing data from JWT.
     */
    protected $decoded;

    /**
     * @var int $accountId value of account_id column for current user.
     */
    protected $accountId;

    /**
     * Override the __construct method to match the requirements of the /verify endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     * @throws ClientErrorException If token format is wrong, decoding of token threw an Exception
     *                              or issuer does not agree with the host.
     */
    public function __construct()
    {
        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("GET");

        // Validate the JWT.
        $this->validateToken();

        // Set the userID based on the JWT.
        $this->setAccountId($this->getDecoded()->sub);

        // Initialise the SQL command and parameters and get the data from the database.
        $this->initialiseSQL();
        $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        $this->setData(array(
            "length" => count($data),
            "message" => "Success",
            "data" => $data
        ));
    }

    /**
     * Check if the token is valid.
     *
     * @throws ClientErrorException If token format is wrong, decoding of token threw an Exception
     *                              or issuer does not agree with the host.
     */
    protected function validateToken()
    {
        $key = SECRET;

        $allHeaders = getallheaders();
        $authorizationHeader = "";

        // Check if correct authorization method was used.
        if (array_key_exists('Authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['Authorization'];
        } elseif (array_key_exists('authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['authorization'];
        }

        // Check if token was included.
        if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
            throw new ClientErrorException("Bearer token required", 401);
        }

        // Remove "Bearer" text from the data.
        $jwt = trim(substr($authorizationHeader, 7));

        // Validate token.
        try {
            $this->setDecoded(JWT::decode($jwt, new Key($key, 'HS256')));
        } catch (Exception $e) {
            throw new ClientErrorException($e->getMessage(), 401);
        }

        // Check if issuer is the same as the host.
        if ($this->getDecoded()->iss != $_SERVER['HTTP_HOST']) {
            throw new ClientErrorException("invalid token issuer", 401);
        }
    }

    protected function initialiseSQL()
    {
        // Create SQL command to get data of the user.
        $sql = "SELECT user_id, email, password, authorisation FROM user WHERE email = :email";
        $this->setSQLCommand($sql);
        $this->setSQLParams(['email' => $this->getUserEmail()]);
    }
    /**
     * Getter for $decoded.
     *
     * @return array Data read from token.
     */
    public function getDecoded()
    {
        return $this->decoded;
    }

    /**
     * Setter for $decoded.
     *
     * @param array $decoded Data read from token.
     */
    public function setDecoded($decoded)
    {
        $this->decoded = $decoded;
    }

    /**
     * Getter for $accountId.
     *
     * @return int AccountId of current user.
     */
    public function getUserEmail()
    {
        return $this->email;
    }

    /**
     * Setter for $accountId.
     *
     * @param int $accountId AccountId of current user.
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }
}