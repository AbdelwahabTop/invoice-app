<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Add_clients_table extends CI_Migration
{

    public function up()
    {
        // Define clients table fields
        $fields = array(
            'name' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
            ),
            'address' => array(
                'type' => 'VARCHAR',
                'constraint' => '255',
            ),
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'hash' => array(
                'type' => 'BIGINT',
                'unsigned' => TRUE,
                'constraint' => '16'
            ),
            'created_at' => array(
                'type' => 'DATETIME',
                'null' => TRUE,
            ),
            'updated_at' => array(
                'type' => 'DATETIME',
                'null' => TRUE,
            ),
        );

        // Add clients table with fields
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('clients');
    }

    public function down()
    {
        $this->dbforge->drop_table('clients');
    }
}