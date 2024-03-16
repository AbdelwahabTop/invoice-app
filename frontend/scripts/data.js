const BASE_URL = "http://localhost/files/backend/";

$(document).ready(function () {
  $("#invoiceTable").DataTable();
  $("#itemsTable").DataTable();
});

function showModal() {
  $("#invoiceModal").css("display", "block");
}

function closeModal() {
  $("#invoiceModal").css("display", "none");
}

$(document).ready(function () {
  $(".back").on("click", function () {
    window.location.href = "http://localhost/files/frontend/sales invoices.php";
  });
});

function generatePage1URL(id) {
  const baseUrl = "sales invoices.php";
  const queryParams = new URLSearchParams();
  queryParams.append("id", id);
  queryParams.append("invokeFunction", "true");
  const mainPageUrl = `${baseUrl}?${queryParams.toString()}`;
  window.location.href = mainPageUrl;
}

async function fetchAllInvoices() {
  try {
    const response = await fetch(`${BASE_URL}invoices`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

async function fetchCustomerById(customerId) {
  try {
    const response = await fetch(`${BASE_URL}get_client_by_id/${customerId}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return null;
  }
}

async function showInvoiceDetails(invoiceId) {
  try {
    const invoiceResponse = await fetch(
      `${BASE_URL}get_invoice_details/${invoiceId}`
    );
    const invoiceData = (await invoiceResponse.json()).invoice;
    const id = invoiceData.id;
    $("#go-to-main").on("click", function () {
      generatePage1URL(id);
    });

    const customerData = (await fetchCustomerById(invoiceData.customer_id))
      .client;

    $("#invoiceID").text(` ${invoiceData.invoice_number || "لا يوجد"}`);
    $("#customerName").text(
      ` ${customerData.customer_name || "لم يتم أدخال اسم العميل مسبقا"}`
    );
    $("#customerPhone").text(
      ` ${customerData.customer_phone || "لم يتم أدخال رقم الهاتف مسبقا"}`
    );
    $("#customerAddress").text(
      ` ${customerData.customer_address || "لم يتم أدخال عنوان العميل مسبقا"}`
    );
    $("#invoiceDate").text(
      ` ${invoiceData.date || "لم يتم أدخال تاريخ الفاتورة مسبقا"}`
    );
    $("#totalAmount").text(` ${invoiceData.totalAmount || "لا يوجد"} `);
    $("#discount").text(` ${invoiceData.discount || "لا يوجد"}`);
    $("#afterDiscount").text(` ${invoiceData.afterDiscount || "لا يوجد"}`);

    const itemsTable = $("#itemsTable").DataTable();
    itemsTable.clear().draw();
    invoiceData.items.forEach((item) => {
      itemsTable.row
        .add([item.name, item.price, item.quantity, item.total_price])
        .draw(false);
    });

    showModal();
  } catch (error) {
    console.error("Error displaying invoice details:", error);
  }
}

async function renderTable(invoices) {
  try {
    if (!invoices) {
      invoices = (await fetchAllInvoices()).invoices;
    }

    const invoiceTable = $("#invoiceTable").DataTable();
    invoiceTable.clear().draw();
    invoices.forEach(async (invoice) => {
      const row = invoiceTable.row
        .add([
          invoice.invoice_number,
          invoice.customer_name,
          invoice.invoice_date,
          invoice.after_discount,
        ])
        .draw(false)
        .node();

      $(row).on("click", function () {
        showInvoiceDetails(invoice.id);
      });
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
}

$(document).on("click", function (event) {
  const modal = $("#invoiceModal")[0];
  if (event.target == modal || $(event.target).hasClass("close")) {
    closeModal();
  }
});
$(".close").on("click", function () {
  closeModal();
});

renderTable();

function searchAutoComplete() {
  const search = $("#customerSearchInput");
  const searchResults = $(".search-results");

  search.on("input", function () {
    const query = $(this).val().trim();

    if (query.length === 0) {
      searchResults.html("");
      return;
    }

    fetch(`${BASE_URL}get_client_by_name/?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        searchResults.html("");
        if (results.length !== 0) {
          searchResults.css("display", "block");
        } else {
          searchResults.css("display", "none");
        }
        results.forEach((customer, i) => {
          const option = $('<li class="search-autocomplete"></li>').text(
            customer.customer_name
          );
          option.on("click", function () {
            search.val(customer.customer_name);
            searchResults.html("");
          });
          searchResults.append(option);
        });
      });
  });

  // Close dropdown when clicking outside
  $(document).on("click", function (event) {
    if (
      !$(event.target).closest(".search-results") &&
      event.target !== search[0]
    ) {
      searchResults.html("");
      searchResults.css("display", "none");
    }
  });
}

searchAutoComplete();

function searchCustomer() {
  const searchBtn = $("#searchBtn");
  searchBtn.on("click", async function () {
    const searchTerm = $("#customerSearchInput").val().trim().toLowerCase();
    const invoices = (await fetchAllInvoices()).invoices;
    const filteredInvoices = invoices.filter((invoice) =>
      invoice.customer_name.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredInvoices);
  });
}
searchCustomer();
