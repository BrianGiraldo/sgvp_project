<?php

  class Params {
    private $params = array();
    private $method = "";
    private $headers = array();

    public function __construct() {
      $this->_parseParams();
    }

    /**
      * @brief Lookup request params
      * @param string $name Name of the argument to lookup
      * @param mixed $default Default value to return if argument is missing
      * @returns The value from the GET/POST/PUT/DELETE value, or $default if not set
      */
    public function get($name, $default = null) {
      if (isset($this->params[$name])) {
        return $this->params[$name];
      } else {
        return $default;
      }
    }

    /**
      * @brief Lookup all request params
      * @returns All values from the GET/POST/PUT/DELETE value, or $default if not set
      */
    public function getall() {
        return $this->params;
    }

    /**
      * @brief Lookup method
      * @returns the method required by client
      */
    public function getmethod() {
        return $this->method;
    }

    /**
      * @brief Lookup method
      * @returns the method required by client
      */
    public function getheaders() {
        return $this->headers;
    }

    private function _parseParams() {

      foreach (getallheaders() as $name => $value) {
          $this->headers[$name] = $value;
      }

      $this->method = $_SERVER['REQUEST_METHOD'];
      if ($this->method == "PUT") {

        $php_input = file_get_contents('php://input');

        parse_str($php_input, $this->params);
        $this->params["raw"] = $php_input;
        $GLOBALS["_{$this->method}"] = $this->params;
        // Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
        $_REQUEST = $this->params + $_REQUEST;

      } 
      else if($this->method == "DELETE"){

        $php_input = file_get_contents('php://input');

        parse_str($php_input, $this->params);
        $this->params["raw"] = $php_input;
        $GLOBALS["_{$this->method}"] = $this->params;
        // Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
        $_REQUEST = $this->params + $_REQUEST;

      }
      else if ($this->method == "GET") {

        $this->params = $_GET;

      }
      else if ($this->method == "POST") {

        $php_input = file_get_contents('php://input');

        parse_str($php_input, $this->params);
        $this->params["raw"] = $php_input;
        $GLOBALS["_{$this->method}"] = $this->params;
        // Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
        $_REQUEST = $this->params + $_REQUEST;
        
        $this->params = $_POST;

      }
    }
  }

?>