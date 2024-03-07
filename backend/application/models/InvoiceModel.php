<?php
class InvoiceModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get()
    {
        $this->db->select('*');
        $this->db->from("invoice");
        return $this->db->get()->result_array();
    }

    public function insert($data)
    {
        $this->db->insert('invoice', $data);
    }
}
