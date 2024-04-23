const BASE_URL = "http://localhost/files/backend/";

$(document).ready(function () {
  $("#invoiceTable").DataTable();
});
function showModal() {
  $("#invoiceModal").css("display", "block");
}

function closeModal() {
  $("#invoiceModal").css("display", "none");
}

$(document).ready(function () {
  $("#main-page").on("click", function () {
    window.location.href = "http://localhost/files/frontend/sales invoices.php";
  });
});
$(document).ready(function () {
  $("#report-page").on("click", function () {
    window.location.href = "http://localhost/files/frontend/time.html";
  });
});
$("#report-page").on("click", function () {
  window.location.href = "http://localhost/files/frontend/time.html";
});

async function renderTable(invoices) {
  try {
    if (!invoices) {
      invoices = (await fetchAllCustomers()).clients;
      console.log(invoices);
    }
    const invoiceTable = $("#invoiceTable").DataTable();
    invoiceTable.clear().draw();
    invoices.forEach(async (invoice) => {
      if (invoice.total_debt > 0) {
        const row = invoiceTable.row
          .add([
            invoice.customer_name,
            invoice.total_debt,
            `
            <input class="debt-input" type="text" data-customer-id="${invoice.id}" value="" />
            <button class="debt-btn" data-customer-id="${invoice.id}">تسديد</button>
        `,
          ])
          .draw(false)
          .node();

        $(row)
          .find(".debt-btn")
          .click(function () {
            const customerId = $(this).data("customer-id");
            const paymentAmount = $(
              `input[data-customer-id="${customerId}"]`
            ).val();
            const totalDebt = invoice.total_debt;
            makePayment(customerId, totalDebt, paymentAmount);
          });
      }
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
}

async function makePayment(customerId, totalDebt, paymentAmount) {
  // Send payment information to the server for the specific customer
  $.ajax({
    url: `${BASE_URL}update_debt`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      customerId: customerId,
      totalDebt: totalDebt,
      paymentAmount: paymentAmount,
    }),
    success: function (response) {
      try {
        Swal.fire({
          title: "تم تسديد المبلغ بنجاح",
          icon: "success",
          confirmButtonText: "حسنا",
        });
        // Update the table with the new data after successful payment
        console.log(
          `Making payment of ${paymentAmount} for customer with ID ${customerId}`
        );
      } catch (error) {
        console.error("Error updating table after payment:", error);
      }
    },
    error: function (xhr, status, error) {
      try {
        Swal.fire({
          title: "حدثت مشكلة اثناء التسديد, الرجاءاعادة المحاولة",
          icon: "error",
          confirmButtonText: "حسنا",
        });
      } catch (error) {
        console.error("Error showing error message:", error);
      }
    },
  });
}

async function fetchAllCustomers() {
  try {
    const response = await fetch(`${BASE_URL}clients`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

renderTable();
