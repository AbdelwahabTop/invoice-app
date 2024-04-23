<?php

// $route['default_controller'] = 'LionInvoices/getClient';
$route['post']['post'] = 'LionInvoices/insert';
$route['pdf']['post'] = 'LionInvoices/insertPdf';
$route['get_client_by_name']['get'] = 'LionInvoices/getClientsByName';
$route['get_client_by_id/(:num)']['get'] = 'LionInvoices/getClientById/$1';
$route['get_items']['get'] = 'LionInvoices/getItems';
$route['get_last_invoice']['get'] = 'LionInvoices/getLastInvoice';

$route['get_invoice_details/(:num)']['get'] = 'LionInvoices/getInvoiceDetails/$1';
$route['invoices']['get'] = 'LionInvoices/getAllInvoices';
$route['clients']['get'] = 'LionInvoices/getAllClients';

$route['get_invoices_between_dates']['get'] = 'LionInvoices/get_invoices_between_dates';
$route['get_total_debt']['get'] = 'LionInvoices/get_total_debt';
$route['update_debt']['post'] = 'LionInvoices/update_debt';
