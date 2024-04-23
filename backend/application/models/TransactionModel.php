<?php
class TransactionModel extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function insertTransaction($data) {
        return $this->db->insert('transaction', $data);
    }

}
