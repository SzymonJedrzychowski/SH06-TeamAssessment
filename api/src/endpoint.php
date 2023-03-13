<?php

/**
 * Endpoint class is responsible for handling all endpoints of the API (as their parent class).
 *
 * @author Szymon Jedrzychowski
 */
abstract class Endpoint
{
    /**
     * @var string $sqlCommand SQL query to get the data.
     */
    private $sqlCommand;

    /**
     * @var array $sqlParams Parameters for the SQL query.
     */
    private $sqlParams;

    /**
     * @var array $data Result of database query.
     */
    private $data;

    /**
     * __construct method that can be used by endpoints to connect to the database
     * and get the data for the endpoint.
     */
    public function __construct()
    {
        // Connect to the database.
        $db = new Database("db/database.db");

        // Initialise the SQL command and parameters and get the data from the database.
        $this->initialiseSQL();
        $data = $db->executeSQL($this->sqlCommand, $this->sqlParams);

        $this->setData(array(
            "length" => count($data),
            "message" => "Success",
            "data" => $data
        ));
    }

    /**
     * Initialise the $sqlCommand and $sqlParams variables.
     * Override in child classes to meet the endpoint requirements.
     */
    protected function initialiseSQL()
    {
        $this->setSQLCommand("");
        $this->setSQLParams([]);
    }

    /**
     * Getter for $SqlCommand
     *
     * @return string SQL command.
     */
    public function getSqlCommand()
    {
        return $this->sqlCommand;
    }

    /**
     * Setter for $SqlCommand
     *
     * @param string $sqlCommand SQL command.
     */
    public function setSqlCommand($sqlCommand)
    {
        $this->sqlCommand = $sqlCommand;
    }

    /**
     * Getter for $sqlParams.
     *
     * @return array Array of parameters.
     */
    public function getSqlParams()
    {
        return $this->sqlParams;
    }

    /**
     * Setter for $sqlParams.
     *
     * @param array $sqlParams Array of parameters.
     */
    public function setSqlParams($sqlParams)
    {
        $this->sqlParams = $sqlParams;
    }

    /**
     * Getter for $data.
     *
     * @return array Data fetched from the database.
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Setter for $data.
     *
     * @param array $data Data fetched from the database.
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * Validate if request method is allowed for specific endpoint.
     *
     * @param string $method Method that is allowed for given endpoint.
     *
     * @throws BadRequest If request method is incorrect.
     */
    protected function validateRequestMethod($method)
    {
        if ($_SERVER['REQUEST_METHOD'] != $method) {
            throw new BadRequest("Incorrect request method for the endpoint.", 405);
        }
    }

    /**
     * Return parameters that are available for specific endpoint.
     *
     * @return array array of available params
     */
    protected function getAvailableParams()
    {
        return [];
    }

    /**
     * Check if correct parameters were provided for specific endpoint.
     *
     * @param string[] $availableParams Array of available parameters.
     *
     * @throws BadRequest If incorrect parameter(s) was provided.
     */
    protected function checkAvailableParams($availableParams)
    {
        if ($_SERVER['REQUEST_METHOD'] == "GET") {
            foreach ($_GET as $key => $value) {
                if (!key_exists($key, $availableParams)) {
                    throw new BadRequest("Invalid parameter " . $key);
                } else {
                    if ($availableParams[$key] == "int" and !is_numeric($value)) {
                        throw new BadRequest("Invalid parameter type " . $key . ". It should be a number.");
                    } else if ($availableParams[$key] == "boolean" and !in_array($value, array('true', 'false'))) {
                        throw new BadRequest("Invalid parameter type " . $key . ". It should be a boolean.");
                    }
                }
            }
        }else if($_SERVER['REQUEST_METHOD'] == "POST") {
            foreach ($_POST as $key => $value) {
                if (!key_exists($key, $availableParams)) {
                    throw new BadRequest("Invalid parameter " . $key);
                } else {
                    if ($availableParams[$key] == "int" and !is_numeric($value)) {
                        throw new BadRequest("Invalid parameter type " . $key . ". It should be a number.");
                    } else if ($availableParams[$key] == "boolean" and !in_array($value, array('true', 'false'))) {
                        throw new BadRequest("Invalid parameter type " . $key . ". It should be a boolean.");
                    }
                }
            }
        }
    }
}
