<?php

$route['default_controller'] = 'LionInvoices/getClient';
$route['post'] = 'LionInvoices/insert';
$route['get_client']['get'] = 'LionInvoices/getClient';
$route['get_items']['get'] = 'LionInvoices/getItems';
$route['get_last_invoice']['get'] = 'LionInvoices/getLastInvoice';
