<?php

class Middleware
{
    public function __construct()
    {
        $CI = &get_instance();
        // get params from header
        $length = $CI->input->get_request_header('Content-Length');
    }
}
