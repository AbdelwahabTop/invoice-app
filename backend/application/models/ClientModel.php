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
        $this->db->select('id, customer_name, customer_phone, customer_address');
    
        $customers = $this->db->get('customer')->result_array();
    
        foreach ($customers as &$customer) {
            $this->db->select('amount, date, notes');
            $this->db->where('customer_id', $customer['id']);
            $transactions = $this->db->get('transaction')->result_array();
    
            $this->db->select('id, invoice_number, invoice_date, invoice_total, discount, after_discount, pdf_path');
            $this->db->where('customer_id', $customer['id']);
            $invoices = $this->db->get('invoice')->result_array();
    
            $customer['transactions'] = $transactions;
            $customer['invoices'] = $invoices;
        }
    
        return $customers;
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
        // Select customer data
        $this->db->select('id, customer_name, customer_phone, customer_address, total_debt');
        
        // Filter customers by name
        $this->db->like('customer_name', $query);
        
        // Get the results from the customer table
        $customers = $this->db->get('customer')->result_array();
        
        // Fetch invoices and transactions for each customer
        foreach ($customers as &$customer) {
            $customer['invoices'] = $this->getInvoicesByCustomerId($customer['id']);
            $customer['transactions'] = $this->getTransactionsByCustomerId($customer['id']);
        }
        
        // Return the customers with their invoices and transactions
        return $customers;
    }
    
    private function getInvoicesByCustomerId($customerId)
    {
        // Fetch invoices for the given customer id
        $this->db->select('*');
        $this->db->where('customer_id', $customerId);
        $invoices = $this->db->get('invoice')->result_array();
        
        // Return the invoices array
        return $invoices;
    }
    
    private function getTransactionsByCustomerId($customerId)
    {
        // Fetch transactions for the given customer id
        $this->db->select('*');
        $this->db->where('customer_id', $customerId);
        $transactions = $this->db->get('transaction')->result_array();
        
        // Return the transactions array
        return $transactions;
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
