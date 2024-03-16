<?php
class ItemsModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_item($itemData, $invoice_id)
    {
        $data = array(
            'item_name' => $itemData['item_name'],
            'price' => $itemData['price'],
            'qty' => $itemData['qty'],
            'total_price' => $itemData['total_price'],
            'invoice_id' => $invoice_id
        );

        $this->db->insert('items', $data);
    }

    public function getItems($query)
    {
        $this->db->select('item_name, price');
        $this->db->like('item_name', $query);
        $query = $this->db->get('items');
        return $query->result_array();
    }

    public function deleteItems($invoice_id)
    {
        $this->db->where('invoice_id', $invoice_id);
        $this->db->delete('items');
    }
}
