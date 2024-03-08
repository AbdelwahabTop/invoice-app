<?php
defined('BASEPATH') or exit('No direct script access allowed');

class LionInvoices extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('ClientModel');
        $this->load->model('InvoiceModel');
        $this->load->model('ItemsModel');
    }

    public function getClient()
    {
        $query = $this->input->get('query');
        $customers = $this->ClientModel->getClients($query);
        echo json_encode(['results' => $customers]);
        return json_encode($customers);
    }

    public function getItems()
    {
        $query = $this->input->get('query');
        $items = $this->ItemsModel->getItems($query);
        echo json_encode(['items' => $items]);
        return json_encode($items);
    }

    public function getLastInvoice()
    {
        $last_invoice = $this->InvoiceModel->getLastInvoice();
        echo json_encode(['last_invoice' => $last_invoice]);
        return json_encode($last_invoice);
    }

    public function insert()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $existing_customer = $this->ClientModel->getClients($data['customer_name']);
        var_dump($existing_customer);

        if ($existing_customer) {
            $customer_id = $existing_customer[0]['id'];
        } else {
            $customer_data = array(
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_address' => $data['customer_address']
            );
            $this->ClientModel->insert($customer_data);
            $customer_id = $this->db->insert_id();
        }

        // Invoice data
        $invoice_data = array(
            'invoice_number' => $data['invoice_number'],
            'invoice_date' => $data['invoice_date'],
            'customer_id' => $customer_id
        );
        $this->InvoiceModel->insert($invoice_data);
        $invoice_id = $this->db->insert_id();

        // Items data
        $items = $data['items'];
        if (!empty($items) && is_array($items)) {
            foreach ($items as $item) {
                $this->ItemsModel->insert_item($item, $invoice_id);
            }
            echo json_encode(
                array(
                    'status' => 200,
                    'message' => 'تمت الاضافة بنجاح',
                    'isAuth' => true,
                ),
                JSON_UNESCAPED_UNICODE
            );
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid items data']);
        }
    }
}
