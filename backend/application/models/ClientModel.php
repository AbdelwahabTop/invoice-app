<?php
class ClientModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function getAllClients()
    {
        $this->db->select('id, customer_name, customer_phone, customer_address, total_debt');
        $query = $this->db->get('customer');
        return $query->result_array();
    }

    public function getClientById($id)
    {
        $this->db->select('id, customer_name, customer_phone, customer_address');
        $this->db->where('id', $id);
        $query = $this->db->get('customer');
        return $query->row();
    }

    public function getClientsByName($query)
    {
        $this->db->select('id, customer_name, customer_phone, customer_address, total_debt');
        $this->db->like('customer_name', $query);
        $query = $this->db->get('customer');
        return $query->result_array();
    }

    public function insert($data)
    {
        return $this->db->insert('customer', $data);
    }

    public function updateDebt($id, $debt)
    {
        $this->db->set('total_debt', $debt);
        $this->db->where('id', $id);
        return $this->db->update('customer');
    }
}
