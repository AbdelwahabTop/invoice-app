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
      invoices = await fetchAllCustomers();
      console.log(invoices);
    }
    const invoiceTable = $("#invoiceTable").DataTable();
    invoiceTable.clear().draw();
    invoices.forEach(async (invoice) => {
      if (invoice.totalDebt > 0) {
        const row = invoiceTable.row
          .add([
            invoice.customer_name,
            invoice.totalInvoiceAmount,
            invoice.totalTransactionAmount,
            invoice.totalDebt,
          ])
          .draw(false)
          .node();

        $(row).click(function () {
          const customerId = invoice.id;
          openPaymentModal(customerId);
        });
      }
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
}

function openPaymentModal(customerId) {
  $("#invoiceModal").css("display", "block");
  $("#invoiceModal").attr("data-customer-id", customerId);

  console.log("Opening payment modal for customer with ID:", customerId);
}

$(document).ready(function () {
  $("#pay").click(function () {
    const customerId = $("#invoiceModal").attr("data-customer-id");
    const paymentAmount = $("#customerName").val();
    const date = $("#dateInput").val();
    const note = $("#noteText").val();
    console.log(customerId, paymentAmount, note);
    makePayment(customerId, paymentAmount, note, date);
  });
});

async function makePayment(customerId, paymentAmount, note, date) {
  console.log(
    "Making payment for customer with ID:",
    customerId,
    paymentAmount,
    note,
    date
  );
  $.ajax({
    url: `${BASE_URL}update_debt`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      customerId: customerId,
      paymentAmount: paymentAmount,
      date: date,
      note: note,
    }),
    success: function (response) {
      try {
        console.log("Payment response:", response);
        Swal.fire({
          title: "تم تسديد المبلغ بنجاح",
          icon: "success",
          confirmButtonText: "حسنا",
        });
        // Update the table with the new data after successful payment
        console.log(
          `Making payment of ${paymentAmount} for customer with ID ${customerId} and note ${note}`
        );
      } catch (error) {
        console.error("Error updating table after payment:", error);
      }
    },
    error: function (xhr, status, error) {
      try {
        console.error("Error making payment:", error);
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
    const data = (await response.json()).clients;
    console.log("Fetched invoices:", data);
    data.forEach((customer) => {
      let totalInvoiceAmount = 0;
      let totalTransactionAmount = 0;

      // Calculate total after_discount for invoices
      customer.invoices.forEach((invoice) => {
        totalInvoiceAmount += parseFloat(invoice.after_discount);
      });

      // Calculate total amount for transactions
      customer.transactions.forEach((transaction) => {
        totalTransactionAmount += parseFloat(transaction.amount);
      });

      // Update the customer object with the totals
      customer.totalInvoiceAmount = totalInvoiceAmount;
      customer.totalTransactionAmount = totalTransactionAmount;
      customer.totalDebt =
        totalInvoiceAmount - totalTransactionAmount > 0
          ? totalInvoiceAmount - totalTransactionAmount
          : 0;
    });
    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

renderTable();

$(document).on("click", function (event) {
  const modal = $("#invoiceModal")[0];
  if (event.target == modal || $(event.target).hasClass("close")) {
    closeModal();
  }
});
$(".close").on("click", function () {
  closeModal();
});
function closeModal() {
  $("#invoiceModal").css("display", "none");
}
