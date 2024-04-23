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
        $this->load->model('TransactionModel');
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

    public function update_debt()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $customer_id = $data['customerId'];
        $pay_debt = $data['paymentAmount'];
        $note = $data['note'] || '';

        var_dump($data);
        var_dump($customer_id);
        var_dump($pay_debt);
        var_dump($note);

        if (empty($customer_id) || empty($pay_debt)) {
            $response['status'] = 'error';
            $response['message'] = 'Customer ID and payment amount are required.';
            echo json_encode($response);
            return;
        }

        $data = array(
            'customer_id' => $customer_id,
            'amount' => $pay_debt,
            'date' => date('Y-m-d'), // Assuming the current date
            'notes' => $note
        );

        if ($this->TransactionModel->insertTransaction($data)) {
            $response['status'] = 'success';
            $response['message'] = 'Payment data inserted successfully.';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to insert payment data.';
        }

        echo json_encode($response);
    }

    public function insert()
    {
        $customer_name = $this->input->post('customer_name');
        $customer_address = $this->input->post('customer_address');
        $customer_phone = $this->input->post('customer_phone');
        $invoice_number = $this->input->post('invoice_number');
        $invoice_date = $this->input->post('invoice_date');
        $invoice_total = $this->input->post('invoice_total');
        $discount = $this->input->post('discount');
        $after_discount = $this->input->post('after_discount');
        $pay_debt = $this->input->post('pay_debt');
        $total_debt = $this->input->post('total_debt');
        $note = $this->input->post('note');
        $items = json_decode($this->input->post('items'), true); // Decode JSON string to array

        // Insert customer data if not exists
        $existing_customer = $this->ClientModel->getClientsByName($customer_name);

        if ($existing_customer) {
            $customer_id = $existing_customer[0]['id'];
        } else {
            $customer_data = array(
                'customer_name' => $customer_name,
                'customer_phone' => $customer_phone,
                'customer_address' => $customer_address,
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
            'pdf_path' => ""
        );

        if ($existing_invoice) {
            $invoice_id = $existing_invoice[0]['id'];
            $this->InvoiceModel->update($invoice_data, $invoice_id);
            $this->ItemsModel->deleteItems($invoice_id);
            var_dump("Deleted items");
        } else {
            $this->InvoiceModel->insert($invoice_data);
            $invoice_id = $this->db->insert_id();
        }      

        //Transaction data
        $data = array(
            'customer_id' => $customer_id,
            'amount' => $pay_debt,
            'date' => $invoice_date,
            'notes' => $note,
        );

        $this->TransactionModel->insertTransaction($data);

        /*if (($pay_debt - $after_discount) >= $total_debt) {
            $debt = 0;
        } elseif ($pay_debt < $after_discount) {
            $debt = ($after_discount - $pay_debt) + $total_debt;
        } elseif ($pay_debt > $after_discount && ($pay_debt - $after_discount) < $total_debt) {
            $debt = $total_debt - ($pay_debt - $after_discount);
        } else {
            $debt = $total_debt;
        } */

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

    public function insertPdf()
    {
        $invoice_number = $this->input->post('invoice_number');

        $invoice_exists = $this->InvoiceModel->getInvoiceByNumber($invoice_number);
        if (!$invoice_exists) {
            echo json_encode([
                'status' => 400,
                'message' => 'الرجاء حفظ الفاتورة قبل ارسالها',
                'num' => 0
            ]);
            return;
        }

        // echo $_FILES['pdfFile']; 
        if (!empty($_FILES['pdfFile']['name'])) {
            $config['upload_path'] = 'uploads/';
            $config['allowed_types'] = '*';
            $config['max_size'] = 202400000;
            $config['encrypt_name'] = TRUE;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('pdfFile')) {
                $error = array('error' => $this->upload->display_errors());
                echo json_encode(['status' => 400, 'message' => 'فشلت العملية']);
                return;
            }

            $file_info = $this->upload->data();
            $pdf_path = 'uploads/' . $invoice_number . '.pdf';

            rename($file_info['full_path'], $pdf_path);
            $this->InvoiceModel->updateInvoicePDF($invoice_number, $pdf_path);
            // $this->sendPDFToWhatsApp($pdf_path);
            if ($this->sendPDFToWhatsApp($pdf_path)) {
                echo json_encode(['status' => 200, 'message' => 'تم رفع الملف بنجاح', 'num' => 1]);
            } else {
                echo json_encode(['status' => 400, 'message' => 'فشلت العملية', 'num' => 0]);
            }
        } else {
            $pdf_path = null;
            echo json_encode(['status' => 400, 'message' => 'لانه اللبيلسئبل فشلت العملية', 'num' => 0]);
        }
    }

    private function sendPDFToWhatsApp($pdf_path)
    {
        $params = array(
            'token' => 'vfjr8idxcdx94r89',
            'to' => '+201016210953',
            'filename' => 'invoice.pdf',
            'document' =>  $pdf_path,
            'caption' => 'document caption'
        );

        // Send request to WhatsApp API
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.ultramsg.com/instance80996/messages/document",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => http_build_query($params),
            CURLOPT_HTTPHEADER => array(
                "content-type: application/x-www-form-urlencoded"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } elseif ($response) {
            echo $response;
            return true;
        } else {
            echo $response;
        }
    }

    public function get_invoices_between_dates()
    {
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');

        $invoices = $this->InvoiceModel->get_invoices_between_dates($start_date, $end_date);

        $this->output->set_content_type('application/json');
        $this->output->set_output(json_encode($invoices));
    }
}
