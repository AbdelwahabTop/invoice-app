<?php

class Middleware
{
    public function __construct()
    {
        $CI = &get_instance();
        $CI->load->library('HeaderMiddleware');
        $CI->load->library('TokenMiddleware');
        $CI->load->library('JwtMiddleware');
    }
}
