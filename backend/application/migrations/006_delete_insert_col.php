<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_delete_insert_col extends CI_Migration
{

    public function up()
    {
        // delete owner, note,emergency,tag
        $this->dbforge->drop_column('task', 'insert_date');
    }

    public function down()
    {
        // Define tasks table fields
        $fields = array(
            'insert_date' => array(
                'type' => 'DATETIME',
                'null' => TRUE,
                'default' => null,
            ),
        );

        // Add tasks table with fields
        $this->dbforge->add_column('task', $fields);
    }
}
