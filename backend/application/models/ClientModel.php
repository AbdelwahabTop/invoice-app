<?php
class ClientModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function getClients($query)
    {
        $this->db->select('id, customer_name');
        $this->db->like('customer_name', $query);
        $query = $this->db->get('customer');
        return $query->result_array();
    }

    public function insert($data)
    {
        return $this->db->insert('customer', $data);
    }
}
