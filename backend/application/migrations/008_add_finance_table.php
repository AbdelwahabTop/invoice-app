<?php defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Add_finance_table extends CI_Migration
{

    public function up()
    {
        $fields = array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'price' => array(
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => FALSE
            ),
            'type' => array(
                'type' => 'ENUM("income","expense")',
                'null' => FALSE
            ),
            'note' => array(
                'type' => 'TEXT',
                'null' => TRUE
            ),
            'created_date' => array(
                'type' => 'DATETIME',
                'null' => FALSE
            ),
            'updated_date' => array(
                'type' => 'DATETIME',
                'null' => FALSE
            )
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('finance_table', TRUE);
    }

    public function down()
    {
        $this->dbforge->drop_table('finance_table');
    }
}
