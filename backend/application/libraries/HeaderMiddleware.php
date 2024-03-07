<?php

class HeaderMiddleware
{
    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description, Authorization, page, perPage, q,today,location');
        header('Content-Type: application/json; charset=utf-8');
        // accept json request
    }
}