<?php

defined('BASEPATH') or exit('No direct script access allowed');



class Migration_Create_project_table extends CI_Migration
{

    public function up()
    {
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'hash' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
            ),
            'title' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
            ),
            'project_type' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
            ),
            'client_hash' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
            ),
            'description' => array(
                'type' => 'TEXT',
                'null' => TRUE,
            ),
            'start_date' => array(
                'type' => 'DATE',
                'null' => TRUE,
            ),
            'deadline' => array(
                'type' => 'DATE',
                'null' => TRUE,
            ),
            'price' => array(
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'null' => TRUE,
            ),
        ));
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('project');
    }

    public function down()
    {
        $this->dbforge->drop_table('project');
    }
}
