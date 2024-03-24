const BASE_URL = "http://localhost/files/backend/";

document.getElementById("submitBtn").addEventListener("click", function () {
  const date1 = document.getElementById("date1").value;
  const date2 = document.getElementById("date2").value;

  fetchInvoicesBetweenDates(date1, date2)
    .then((invoices) => {
      displayInvoices(invoices);
    })
    .catch((error) => {
      console.error("Error fetching invoices:", error);
    });
});
document.getElementById("route").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/data.html";
});
// document.querySelector(".back").addEventListener("click", function () {
//   window.location.href = "http://localhost/files/frontend/sales invoices.php";
// });
document.getElementById("reset").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/time.html";
});
document.getElementById("main-page").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/sales invoices.php";
});

function fetchInvoicesBetweenDates(date1, date2) {
  return fetch(
    `${BASE_URL}get_invoices_between_dates?start_date=${date1}&end_date=${date2}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

function displayInvoices(invoices) {
  let totalAmount = 0;
  let parent = document
    .querySelector(".center")
    .querySelector(`#itemContainer`);

  if (invoices.length === 0) {
    parent.textContent = "لا توجد فواتير بين التواريخ المحددة";
    parent.style.textAlign = "center";
    parent.style.fontSize = "30px";
    parent.style.fontWeight = "bold";
    parent.style.marginTop = "30px";
    parent.style.color = "red";
    parent.style.fontFamily = "Cairo";
    return;
  }

  invoices.forEach((invoice, index) => {
    parent.append(
      generateItemRow(
        index + 1,
        invoice.invoice_number,
        invoice.invoice_date,
        invoice.after_discount
      )
    );
    totalAmount += parseFloat(invoice.after_discount);
  });

  document.querySelector(".navl .row .total").textContent = totalAmount;
}

function generateItemRow(colNum, invoiceNumber, invoiceData, totalPrice) {
  let content = `
  <div class="row item-row">
  <div class="cell0">
    <p>${colNum}</p>
  </div>
  <div class="report-info-cell">
    <p>${invoiceNumber}</p>
  </div>
  <div class="report-info-cell">
    <p>${invoiceData}</p>
  </div>
  <div class="report-info-cell">
    <p>${totalPrice}</p>
  </div>
</div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const newItemRow = tempDiv.firstElementChild;

  return newItemRow;
}
