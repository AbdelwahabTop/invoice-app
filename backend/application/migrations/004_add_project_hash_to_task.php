<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Add_project_hash_to_task extends CI_Migration
{

    public function up()
    {
        // Define tasks table fields
        $fields = array(
            'project_hash' => array(
                'type' => 'BIGINT',
                'unsigned' => TRUE,
                'constraint' => '16'
            ),
            'created_at' => array(
                'type' => 'DATETIME',
                'null' => TRUE,
                'default' => null,
            ),
            'updated_at' => array(
                'type' => 'DATETIME',
                'null' => TRUE,
                'default' => null,
            ),
        );

        // Add tasks table with fields
        $this->dbforge->add_column('task', $fields);
    }

    public function down()
    {
        // drop project_hash column and created_at, updated_at columns
        $this->dbforge->drop_column('task', 'project_hash');
        $this->dbforge->drop_column('task', 'created_at');
        $this->dbforge->drop_column('task', 'updated_at');
    }
}
