<?php

class TokenMiddleware
{
    public function __construct()
    {
    }

    public function getBearerToken()
    {
        $headers = apache_request_headers();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        if (isset($authorization)) {
            if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
                return $matches[1];
            }
        }
        return 0;
    }

    public function checkToken($token)
    {
        if ($token) {
            $jwt = new JwtMiddleware();
            $decoded = $jwt->decode($token);
            if ($decoded) {
                return $decoded;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public function main()
    {
        // get token from header
        $token = $this->getBearerToken();
        // check token
        $token = $this->checkToken($token);
        // if token is valid
        if (!$token) {
            echo json_encode(
                array(
                    "status" => 401,
                    "message" => "يجب تسجيل الدخول للوصول لهذه الصفحة",
                    "isAuth" => false,
                    "data" => null,
                    "token" => null
                )
            );
            exit();
        } else {
            // update token
            $jwt = new JwtMiddleware();
            $token = $jwt->encode($token);
            return $token;
        }
    }
}