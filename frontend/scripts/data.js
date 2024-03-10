/////////////////////New Page///////////////////////////////////////////////
const BASE_URL = "http://localhost/files/backend/";

function showModal() {
  document.getElementById("invoiceModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
  document.getElementById("invoiceModal").style.display = "none";
}

// Function to fetch all invoices from the server
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
    console.log("Invoice Data", invoiceData);

    const customerData = (await fetchCustomerById(invoiceData.customer_id))
      .client;
    console.log("Customer Data", customerData);

    document.getElementById(
      "invoiceID"
    ).textContent = `Invoice ID: ${invoiceData.id}`;
    document.getElementById(
      "customerName"
    ).textContent = `Customer: ${customerData.customer_name}`;
    document.getElementById(
      "customerPhone"
    ).textContent = `Phone: ${customerData.customer_phone}`;
    document.getElementById(
      "customerAddress"
    ).textContent = `Address: ${customerData.customer_address}`;
    document.getElementById(
      "invoiceDate"
    ).textContent = `Date: ${invoiceData.date}`;
    document.getElementById(
      "totalAmount"
    ).textContent = `Total Amount: ${invoiceData.totalAmount}`;
    document.getElementById(
      "discount"
    ).textContent = `Discount: ${invoiceData.discount}`;
    document.getElementById(
      "afterDiscount"
    ).textContent = `After Discount: ${invoiceData.afterDiscount}`;

    const itemsTable = document.querySelector("#itemsTable tbody");
    itemsTable.innerHTML = "";
    invoiceData.items.forEach((item) => {
      const itemRow = document.createElement("tr");
      itemRow.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total_price}</td>
          `;
      itemsTable.appendChild(itemRow);
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
    console.log("Invoices", invoices);
    const tableBody = document.querySelector("#invoiceTable tbody");
    tableBody.innerHTML = "";

    invoices.forEach(async (invoice) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${invoice.invoice_number}</td>
            <td>${invoice.customer_name}</td>
            <td>${invoice.invoice_date}</td>
            <td>${invoice.after_discount}</td>
          `;
      row.addEventListener("click", () => showInvoiceDetails(invoice.id));
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("invoiceModal");
  if (event.target == modal) {
    closeModal();
  }
};

renderTable();

function searchAutoComplete() {
  const search = document.getElementById("customerSearchInput");
  //   const searchTerms = search.value.trim().toLowerCase();
  const searchResults = document.querySelector(".search-results");

  search.addEventListener("input", function () {
    const query = this.value.trim();

    if (query.length === 0) {
      searchResults.innerHTML = "";
      return;
    }
    fetch(`${BASE_URL}get_client_by_name/?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        searchResults.innerHTML = "";
        if (results.length !== 0) {
          searchResults.style.display = "block";
        } else {
          searchResults.style.display = "none";
        }
        results.forEach((customer, i) => {
          const option = document.createElement("li");
          option.textContent = customer.customer_name;
          option.classList.add("search-autocomplete");
          option.addEventListener("click", function () {
            search.value = customer.customer_name;
            searchResults.innerHTML = "";
          });
          searchResults.appendChild(option);
        });
      });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".search-results") && event.target !== search) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
    }
  });
}

searchAutoComplete();

function searchCustomer() {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", async function () {
    const searchTerm = document
      .getElementById("customerSearchInput")
      .value.trim()
      .toLowerCase();
    const invoices = (await fetchAllInvoices()).invoices;
    const filteredInvoices = invoices.filter((invoice) =>
      invoice.customer_name.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredInvoices);
  });
}
searchCustomer();
// function renderTable(data) {
//     const tableBody = document.querySelector("#invoiceTable tbody");
//     tableBody.innerHTML = "";
//     data.forEach(invoice => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${invoice.id}</td>
//         <td>${invoice.customer_name}</td>
//         <td>${invoice.date}</td>
//         <td>${invoice.totalAmount}</td>
//       `;
//       row.addEventListener("click", () => showInvoiceDetails(invoice));
//       tableBody.appendChild(row);
//     });
//   }

// async function fetchCustomers() {
//   try {
//     const response = await fetch(`${BASE_URL}clients`);
//     const data = await response.json();
//     return data.clients;
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     return []; // Return an empty array or handle the error accordingly
//   }
// }

// const customers = await fetchCustomers();
// console.log(customers);

// Sample data for demonstration
// const customers = [
//   {
//     id: 1,
//     name: "John Doe",
//     phone: "123-456-7890",
//     address: "123 Main St",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     phone: "456-789-0123",
//     address: "456 Elm St",
//   },
// ];

// const invoices = [
//   {
//     id: 1,
//     customer_id: 1,
//     customer_name: "John Doe",
//     date: "2024-03-01",
//     totalAmount: 100,
//     discount: 10,
//     afterDiscount: 90,
//     items: [
//       { name: "Item 1", price: 10, quantity: 2, total_price: 20 },
//       { name: "Item 2", price: 20, quantity: 1, total_price: 20 },
//     ],
//   },
//   {
//     id: 2,
//     customer_id: 2,
//     customer_name: "Jane Smith",
//     date: "2024-03-02",
//     totalAmount: 150,
//     discount: 15,
//     afterDiscount: 135,
//     items: [
//       { name: "Item 3", price: 30, quantity: 3, total_price: 90 },
//       { name: "Item 4", price: 15, quantity: 2, total_price: 30 },
//     ],
//   },
// ];

// // Populate the table with invoice data
// const tableBody = document.querySelector("#invoiceTable tbody");
// invoices.forEach((invoice) => {
//   const row = document.createElement("tr");
//   row.innerHTML = `
//         <td>${invoice.id}</td>
//         <td>${invoice.customer_name}</td>
//         <td>${invoice.date}</td>
//         <td>${invoice.totalAmount}</td>
//       `;
//   row.addEventListener("click", () => showInvoiceDetails(invoice));
//   tableBody.appendChild(row);
// });

// Function to search for a customer
// function searchCustomer() {
//   const searchTerm = document
//     .getElementById("customerSearchInput")
//     .value.trim()
//     .toLowerCase();
//   const filteredInvoices = invoices.filter((invoice) =>
//     invoice.customer_name.toLowerCase().includes(searchTerm)
//   );
//   renderTable(filteredInvoices);
// }

// Function to search for invoices by date
function searchInvoicesByDate() {
  const date = document.getElementById("invoiceDateInput").value;
  const filteredInvoices = invoices.filter((invoice) => invoice.date === date);
  renderTable(filteredInvoices);
}
