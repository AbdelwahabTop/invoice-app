<?php

$route['default_controller'] = 'LionInvoices/getClient';
$route['post'] = 'LionInvoices/insert';
$route['get_client_by_name']['get'] = 'LionInvoices/getClientsByName';
$route['get_client_by_id/(:num)']['get'] = 'LionInvoices/getClientById/$1';
$route['get_items']['get'] = 'LionInvoices/getItems';
$route['get_last_invoice']['get'] = 'LionInvoices/getLastInvoice';

$route['get_invoice_details/(:num)']['get'] = 'LionInvoices/getInvoiceDetails/$1';
$route['invoices']['get'] = 'LionInvoices/getAllInvoices';
$route['clients']['get'] = 'LionInvoices/getAllClients';
