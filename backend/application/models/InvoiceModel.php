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
            'customer_phone' => $invoiceDetails[0]['customer_phone'],
            'customer_address' => $invoiceDetails[0]['customer_address'],
            'date' => $invoiceDetails[0]['invoice_date'],
            'invoice_number' => $invoiceDetails[0]['invoice_number'],
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

    public function getInvoiceByNumber($invoice_number)
    {
        $this->db->where('invoice_number', $invoice_number);
        $query = $this->db->get('invoice');
        return $query->result_array();
    }

    public function insert($data)
    {
        $this->db->insert('invoice', $data);
    }

    public function update($data, $invoice_id)
    {
        $this->db->where('id', $invoice_id);
        $this->db->update('invoice', $data);
    }

    public function updateInvoicePDF($invoiceNumber, $pdfPath)
    {
        $this->db->where('invoice_number', $invoiceNumber);
        $this->db->update('invoice', array('pdf_path' => $pdfPath));
    }

    public function get_invoices_between_dates($start_date, $end_date)
    {
        $this->db->select('invoice.*, customer.customer_name, customer.customer_phone, customer.customer_address');
        $this->db->from('invoice');
        $this->db->join('customer', 'invoice.customer_id = customer.id');
        $this->db->where('invoice_date >=', $start_date);
        $this->db->where('invoice_date <=', $end_date);
        $query = $this->db->get();
        return $query->result_array();
    }
}
