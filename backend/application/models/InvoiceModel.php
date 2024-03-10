<?php
class InvoiceModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function getAllInvoices()
    {
        $this->db->select('invoice.*, customer.customer_name, customer.customer_phone, customer.customer_address');
        $this->db->from('invoice');
        $this->db->join('customer', 'invoice.customer_id = customer.id');
        $query = $this->db->get();
        return $query->result_array();
    }

    public function getInvoiceDetails($id)
    {
        $this->db->select('invoice.*, customer.customer_name, customer.customer_phone, customer.customer_address, items.item_name, items.price, items.qty, items.total_price');
        $this->db->from('invoice');
        $this->db->join('customer', 'invoice.customer_id = customer.id');
        $this->db->join('items', 'invoice.id = items.invoice_id');
        $this->db->where('invoice.id', $id);
        $query = $this->db->get();

        $invoiceDetails = $query->result_array();

        // Organize fetched data into the desired format
        $formattedInvoice = array(
            'id' => $invoiceDetails[0]['id'],
            'customer_id' => $invoiceDetails[0]['customer_id'],
            'customer_name' => $invoiceDetails[0]['customer_name'],
            'date' => $invoiceDetails[0]['invoice_date'],
            'totalAmount' => $invoiceDetails[0]['invoice_total'],
            'discount' => $invoiceDetails[0]['discount'],
            'afterDiscount' => $invoiceDetails[0]['after_discount'],
            'items' => array()
        );

        foreach ($invoiceDetails as $detail) {
            $formattedInvoice['items'][] = array(
                'name' => $detail['item_name'],
                'price' => $detail['price'],
                'quantity' => $detail['qty'],
                'total_price' => $detail['total_price']
            );
        }

        return $formattedInvoice;
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
