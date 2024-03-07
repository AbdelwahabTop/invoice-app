<?php defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Add_name_to_finance_table extends CI_Migration
{

    public function up()
    {
        $fields = array(
            'name' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => FALSE
            )
        );

        $this->dbforge->add_column('finance_table', $fields);
    }

    public function down()
    {
        $this->dbforge->drop_column('finance_table', 'name');
    }
}
