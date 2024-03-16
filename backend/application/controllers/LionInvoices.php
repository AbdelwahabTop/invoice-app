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

    public function getAllClients()
    {
        $clients = $this->ClientModel->getAllClients();
        echo json_encode(['clients' => $clients]);
        return json_encode($clients);
    }

    public function getClientById($id)
    {
        $client = $this->ClientModel->getClientById($id);
        echo json_encode(['client' => $client]);
        return json_encode($client);
    }

    public function getClientsByName()
    {
        $query = $this->input->get('query');
        $customers = $this->ClientModel->getClientsByName($query);
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

    public function getAllInvoices()
    {
        $invoices = $this->InvoiceModel->getAllInvoices();
        echo json_encode(['invoices' => $invoices]);
        return json_encode($invoices);
    }

    public function getInvoiceDetails($id)
    {
        $invoice = $this->InvoiceModel->getInvoiceDetails($id);
        echo json_encode(['invoice' => $invoice]);
        return json_encode($invoice);
    }

    public function getLastInvoice()
    {
        $last_invoice = $this->InvoiceModel->getLastInvoice();
        echo json_encode(['last_invoice' => $last_invoice]);
        return json_encode($last_invoice);
    }

    public function insert()
    {
        var_dump("Start");
        $customer_name = $this->input->post('customer_name');
        $customer_address = $this->input->post('customer_address');
        $customer_phone = $this->input->post('customer_phone');
        $invoice_number = $this->input->post('invoice_number');
        $invoice_date = $this->input->post('invoice_date');
        $invoice_total = $this->input->post('invoice_total');
        $discount = $this->input->post('discount');
        $after_discount = $this->input->post('after_discount');
        $items = json_decode($this->input->post('items'), true); // Decode JSON string to array


        if (!empty($_FILES['pdfFile']['name'])) {
            $config['upload_path'] = 'uploads/';
            $config['allowed_types'] = '*';
            $config['max_size'] = 202400000; // Maximum file size in KB (10MB)
            $config['encrypt_name'] = TRUE; // Encrypt the uploaded file's name
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('pdfFile')) {
                $error = array('error' => $this->upload->display_errors());
                echo json_encode($error);
                return;
            }

            $file_info = $this->upload->data();
            $pdf_path = 'uploads/' . $invoice_number . '.pdf';

            rename($file_info['full_path'], $pdf_path);
            var_dump("file is uploaded successfully", $pdf_path);
        } else {
            $pdf_path = null;
        }

        // Insert customer data if not exists
        $existing_customer = $this->ClientModel->getClientsByName($customer_name);

        if ($existing_customer) {
            $customer_id = $existing_customer[0]['id'];
        } else {
            $customer_data = array(
                'customer_name' => $customer_name,
                'customer_phone' => $customer_phone,
                'customer_address' => $customer_address
            );
            $this->ClientModel->insert($customer_data);
            $customer_id = $this->db->insert_id();
        }

        // Invoice data
        $existing_invoice = $this->InvoiceModel->getInvoiceByNumber($invoice_number);
        $invoice_data = array(
            'invoice_number' => $invoice_number,
            'invoice_date' => $invoice_date,
            'invoice_total' => $invoice_total,
            'discount' => $discount,
            'after_discount' => $after_discount,
            'customer_id' => $customer_id,
            'pdf_path' => $pdf_path
        );
        if ($existing_invoice) {
            var_dump("Start existing_invoice");
            $invoice_id = $existing_invoice[0]['id'];
            $this->InvoiceModel->update($invoice_data, $invoice_id);
            var_dump("End existing_invoice", $invoice_data);
            $this->ItemsModel->deleteItems($invoice_id);
            var_dump("Deleted items");
        } else {
            $this->InvoiceModel->insert($invoice_data);
            $invoice_id = $this->db->insert_id();
            var_dump("Insert new invoice", $invoice_data);
        }

        // Items data
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
