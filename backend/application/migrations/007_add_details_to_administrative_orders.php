<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Add_details_to_administrative_orders extends CI_Migration
{

    public function up()
    {
        $this->dbforge->add_column('administrative_orders', [
            'details' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'number'
            ]
        ]);
    }

    public function down()
    {
        $this->dbforge->drop_column('administrative_orders', 'details');
    }
}
