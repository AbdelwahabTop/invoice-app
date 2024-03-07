<?php
defined('BASEPATH') or exit('No direct script access allowed');

class LionClient extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('LionClientModel');
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }




    public function insertClient()
    {
        $name = $this->input->post("client_name");
        $phone = $this->input->post("client_phone");
        $address = $this->input->post("client_address");

        $data = [
            "name" => $name,
            "phone" => $phone,
            "address" => $address
        ];
        $client = $this->LionClientModel->insertClient($data);
        if (!$client) {
            echo json_encode(
                array(
                    'status' => 400,
                    'message' => 'العميل موجود بل الفعل',
                    'isAuth' => true,
                ),
                JSON_UNESCAPED_UNICODE
            );
            exit();
        }
        echo json_encode(
            array(
                'status' => 200,
                'message' => ' تم الادخال بنجاح',
                'isAuth' => true,
            ),
            JSON_UNESCAPED_UNICODE
        );
        exit();
    }
}
