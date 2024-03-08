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

    public function getLastInvoice()
    {
        $this->db->select('invoice_number');
        $this->db->order_by('id', 'DESC');
        $this->db->limit(1);
        $query = $this->db->get('invoice');

        if ($query->num_rows() > 0) {
            $row = $query->row();
            return $row->invoice_number;
        } else {
            return null;
        }
    }

    public function insert($data)
    {
        $this->db->insert('invoice', $data);
    }
}
