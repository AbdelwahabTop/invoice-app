const BASE_URL = "http://localhost/files/backend/";

document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll("a");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
});
document.getElementById("print").addEventListener("click", function () {
  print();
});
document.getElementById("reset").addEventListener("click", function () {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.delete("invokeFunction");
  queryParams.delete("id");
  window.location.href = "http://localhost/files/frontend/sales invoices.php";
});
document.getElementById("route").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/data.html";
});
document.getElementById("report-page").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/time.html";
});
document.getElementById("debt-page").addEventListener("click", function () {
  window.location.href = "http://localhost/files/frontend/debt.html";
});

function parseURLParams() {
  const queryParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of queryParams.entries()) {
    params[key] = value;
  }
  return params;
}
// Function to check if the invokeFunction parameter is set to true
function shouldInvokeFunction(params) {
  return (
    params.hasOwnProperty("invokeFunction") &&
    params["invokeFunction"] === "true"
  );
}
// Function to handle invoking the function if needed
function handleFunctionInvocation(params) {
  if (shouldInvokeFunction(params)) {
    const id = params["id"];
    // Invoke your function here using the received ID
    setTimeout(() => {
      showInvoiceInMainPage(parseInt(id));
    }, 1000);
  }
}
const urlParams = parseURLParams();
handleFunctionInvocation(urlParams);

const CUSTOMER_NAME = document.getElementById("NAME");
const CUSTOMER_ADDRESS = document.getElementById("ADDRESS");
const CUSTOMER_PHONE = document.getElementById("PHONE");
const INVOICE_NUM = document.getElementById("INV-NUM");
const INVOICE_DATE = document.getElementById("datepicker");
////////////////////////////////////////////////////////////////////////////
var discountEles = document.querySelectorAll(".discount");
var afterDiscountEles = document.querySelectorAll(".after-discount");
var lastDiscount = discountEles[discountEles.length - 1];
var lastAfterDiscount = afterDiscountEles[afterDiscountEles.length - 1];
var invTotalSec = document.querySelectorAll(".total");
var lastTotal = invTotalSec[invTotalSec.length - 1];
var totalDebt = document.querySelectorAll(".totalDebt");
var lastTotalDebt = totalDebt[totalDebt.length - 1];
var payDebt = document.querySelectorAll(".payDebt");
var lastPayDebt = payDebt[payDebt.length - 1];

lastDiscount.addEventListener("input", () => {
  calcTotal();
});

function reSelectElements() {
  invTotalSec = document.querySelectorAll(".total");
  lastTotal = invTotalSec[invTotalSec.length - 1];
  discountEles = document.querySelectorAll(".discount");
  afterDiscountEles = document.querySelectorAll(".after-discount");
  lastDiscount = discountEles[discountEles.length - 1];
  lastAfterDiscount = afterDiscountEles[afterDiscountEles.length - 1];
  totalDebt = document.querySelectorAll(".totalDebt");
  lastTotalDebt = totalDebt[totalDebt.length - 1];
  payDebt = document.querySelectorAll(".payDebt");
  lastPayDebt = payDebt[payDebt.length - 1];
}
////////////////////////////////////////////////////////////////////////////
///////////////////////// Create New Page ////////////////////////////////////
function createNewPage(num) {
  var newPage = document.createElement("div");
  newPage.classList.add("page");
  newPage.id = `page${num}`;

  newPage.innerHTML = `
  <!-- صفحة يمكنك تكرارها ------------------------------------------------------------------------------->

  <div class="header"></div>

  <div class="center">
    <h1>&nbsp;</h1>

    <div class="informations">
      <div class="navr">
        <!-- معلومات المشتري مع اسم المنظم والمندوب ---------------------------------------------->
        <div class="row">
        <div class="cell1">
          <p>حضرة السيد</p>
        </div>
        <!-- | -->
          <input readonly value="${CUSTOMER_NAME.value}" type="text" class="cell2 clientName auto-name" placeholder="....أكتب اسم العميل الثلاثي" />
          <div class="cell1">
            <p>الهاتف</p>
          </div>
          <input readonly value="${CUSTOMER_PHONE.value}" type="text" class="clientPhone auto-phone" placeholder="أدخل رقم الهاتف..." />
        </div>

      <div class="row">
        <div class="cell1">
          <p>العنوان</p>
        </div>
        <!-- | -->
        <div  class="cell2 clientAddress auto-address">
          
          <p>${CUSTOMER_ADDRESS.innerText}</p>
        </div>
      </div>
    </div>

      <div class="navl">
        <!-- معلومات القائمة ------------------------------------------------------->
        <div class="row">
          <div class="cell1">
            <p>رقم القائمة</p>
          </div>
          <!-- | -->
          <div class="cell2 invoiceNumber auto-invoice-num">
            <p>${INVOICE_NUM.innerText}</p>
          </div>
        </div>

        <div class="row">
          <div class="cell1">
            <p>
              التاريخ
            </p>
          </div>
          <!-- | -->
          <div class="cell2 auto-date"><p>${INVOICE_DATE.value}</p></div>
        </div>
      </div>
    </div>


    <div class="list">
      <!-- تصنيف القائمة ------------------------------------------------------>
      <div class="row">
        <div class="cell0"><p>ت</p></div>
        <div class="cell2"><p>التفـــــاصيــــل</p></div>
        <div class="cell3"><p>الكمية</p></div>
        <div class="cell4"><p>ســم</p></div>
        <div class="cell5"><p>متــر</p></div>
        <div class="cell6"><p>ســعر الجملة</p></div>
        <div class="cell7"><p>المبلغ الكلــي</p></div>
        <div class="cell8">
        <p>حذف</p>
      </div>
      </div>
    </div>
    <div class="listinfo open" id="itemContainer">
      <!-- تفاصيل القائمة ------------------------------------------------------>

     
    </div>
  </div>

  <div class="footer">
    <div class="price">
      <!-- مجموع الاسعار والخصم والباقي  ------------------------------------------------------->
      <div class="navr">
        <div class="row">
          <div class="note">
            <p>
              الملاحظات :&nbsp;&nbsp;<span style="font-weight: 400"
                >تم ارسال البضاعة بواسطة شركة اور لتوصيل السريع</span
              >
            </p>
          </div>
        </div>
      </div>

      <div class="navl">
        <div class="row">
          <div class="cell1"><p>مجموع القائمة</p></div>
          <!-- | -->
          <div class="cell2 total"><p>&nbsp;</p></div>
        </div>

        <div class="row">
          <div class="cell1 "><p>الخصم</p></div>
          <!-- | -->
          <div contenteditable="true" class="cell2 discount"><input type="text" /></div>
        </div>

        <div class="row">
          <div class="cell1"><p>الحساب بعد الخصم</p></div>
          <!-- | -->
          <div class="cell2 after-discount"><p>&nbsp;</p></div>
        </div>

        <div class="row">
        <div  class="cell1 ">
          <p>الواصل</p>
        </div>
        <!-- | -->
        <div contenteditable="true" class="cell2 payDebt">
          <p>&nbsp;</p>
        </div>
      </div>

      <div class="row">
        <div class="cell1 ">
          <p>الدين السابق</p>
        </div>
        <!-- | -->
        <div class="cell2 totalDebt">
          <p>&nbsp;</p>
        </div>
      </div>
      </div>
    </div>
  </div>
    `;
  document.querySelector(".book").appendChild(newPage);
  currentPage = newPage;
  currentItemCount = 0;
  reSelectElements();
  resetValues();
  autoFillCusData();
  calcTotal();
}
///////// ملئ البيانات تلقائيا للمستخدم في الصفحات الجديدة //////////
function autoFillCusData() {
  const cusAutoName = document.querySelectorAll(`.auto-name`);
  const cusAutoPhone = document.querySelectorAll(`.auto-phone`);
  const cusAutoAddress = document.querySelectorAll(`.auto-address`);
  const invAutoNum = document.querySelectorAll(`.auto-invoice-num`);
  const invAutoDate = document.querySelectorAll(`.auto-date`);
  CUSTOMER_NAME.addEventListener("input", function () {
    cusAutoName.forEach((ele) => {
      ele.value = this.value;
    });
  });
  CUSTOMER_PHONE.addEventListener("input", function () {
    cusAutoPhone.forEach((ele) => {
      ele.value = this.value;
    });
  });
  CUSTOMER_ADDRESS.addEventListener("input", function () {
    cusAutoAddress.forEach((ele) => {
      ele.innerText = this.innerText;
    });
  });
  INVOICE_NUM.addEventListener("input", function () {
    invAutoNum.forEach((ele) => {
      ele.innerText = this.innerText;
    });
  });
  INVOICE_DATE.addEventListener("input", function () {
    invAutoDate.forEach((ele) => {
      ele.innerText = this.value;
    });
  });
}
/////////////// عند انشاء صفحة جديدة تفريغ بيانات السعر والخصم من الصفحات القديمة ووضعه بالصفحة الجديدة //////////
function resetValues() {
  let discountNum = discountEles[discountEles.length - 2].innerText;
  let total_debt = totalDebt[totalDebt.length - 2].innerText;
  let pay_debt = payDebt[payDebt.length - 2].innerText;
  invTotalSec.forEach((ele) => {
    ele.innerText = " ";
  });
  discountEles.forEach((ele) => {
    ele.innerText = " ";
  });
  afterDiscountEles.forEach((ele) => {
    ele.innerText = "";
  });
  totalDebt.forEach((ele) => {
    ele.innerText = "";
  });
  payDebt.forEach((ele) => {
    ele.innerText = "";
  });
  lastDiscount.innerText = discountNum;
  lastTotalDebt.innerText = total_debt;
  lastPayDebt.innerText = pay_debt;

  lastDiscount.addEventListener("input", (e) => {
    calcTotal();
  });
}
///////////////////////// حساب الاجمالي و بعد الخصم //////////////////////////
const calcTotal = () => {
  let total = 0;
  for (let i = 0; i < elePerPage.length; i++) {
    const rowsItems = document
      .querySelector(containerID + i)
      .querySelectorAll(".item-row .cell7");
    rowsItems.forEach((item) => {
      total += parseFloat(item.innerText.replace(/,/g, ""));
    });
  }
  lastTotal.innerText = total;
  if (total >= parseFloat(lastDiscount.innerText)) {
    lastAfterDiscount.innerText = total - parseFloat(lastDiscount.innerText);
  } else {
    lastAfterDiscount.innerText = "الخصم كبير او اجعل الخصم صفر";
  }
  return total;
};
document.getElementById("create").addEventListener("click", function () {
  elePerPage.push(0);
  createNewPage(elePerPage.length - 1);
});
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Add new item to the list ///////////////////////////////////////
var currentValue = 2;
var maximumItemsPerPage = 17;
var currentItemCount = 0;
var currentPage = document.querySelector(".book .page");
var elePerPage = [1];
var containerID = "#page";
var currentCell = 1;
function getElementByXpath(path, parent) {
  return document.evaluate(
    path,
    parent,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function addNewItem(pointerEvent, price, totalPrice, quantity, itemName) {
  const money = price || "00.00";
  const qty = quantity || 1;
  const totalMony = totalPrice || "00.00";
  const item = itemName || "";
  if (currentPage === null || currentItemCount >= maximumItemsPerPage) {
    elePerPage.push(0);
    createNewPage(elePerPage.length - 1);
  }
  for (let i = 0; i < elePerPage.length; i++) {
    if (elePerPage[i] < maximumItemsPerPage) {
      elePerPage[i]++;
      // console.log(elePerPage);
      let parent = document
        .querySelector(containerID + i)
        .querySelector(".center")
        .querySelector(`#itemContainer`);

      // currentCell = elePerPage.reduce((acc, currVal) => {
      //   return acc + currVal;
      // }, 0);
      currentCell++;

      parent.append(generateItemRow(currentCell, qty, money, totalMony, item));
      break;
    }
  }
  currentItemCount++;
  if (currentItemCount >= maximumItemsPerPage) {
    currentPage = null;
  }
}

// Function to generate a new item row
function generateItemRow(colNum, quantity, price, totalPrice, itemName) {
  let content = `
  <div class="row item-row">
    <div class="cell0"><p>${colNum}</p></div>
    <div>
    <input type="text" class="itemNameInput" placeholder="...أكتب اسم السلعة" value="${itemName}">
  </div>
  <ul class="itemAutocomplete"></ul>
    <div contenteditable="true" class="cell3 qty"><p>${quantity}</p></div>
    <div contenteditable="true" class="cell5 meter">
      <p class="c1">00.00</p>
    </div>
    <div contenteditable="true" class="cell6 price">
      <p class="c1">${price}</p>
    </div>
    <div class="cell7 total-price"><p>${totalPrice}</p></div>
    <div class="cell8 delete">
    <i class="fa-solid fa-trash-can" style="color: #f20d0d;"></i>            
  </div>
  </div>`;

  // Create a temporary div element to attach the new row
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const newItemRow = tempDiv.firstElementChild;

  // Attach event listener to the autocomplete input field of the new row

  const newItemNameInput = newItemRow.querySelector(".itemNameInput");

  const newItemAutocomplete = newItemRow.querySelector(".itemAutocomplete");
  const newItemPrice = newItemRow.querySelector(".cell6");
  // const newItemMeter = newItemRow.querySelector(".cell5");

  // newItemPrice.addEventListener("click", function () {
  //   newItemPrice.querySelector(".c1").textContent = " ";
  //   // newItemPrice.querySelector(".c1").focus();
  // });

  // newItemMeter.addEventListener("click", function () {
  //   newItemMeter.querySelector(".c1").textContent = " ";
  //   // newItemMeter.querySelector(".c1").focus();
  // });

  attachAutocompleteListener(
    newItemNameInput,
    newItemAutocomplete,
    newItemPrice
  );
  attachRealTimeCalculations(newItemRow);
  const deleteBtn = newItemRow.querySelector(".delete");
  deleteBtn.addEventListener("click", handleDelete);

  return newItemRow;
}
/////////////////////////////Delete Item////////////////////////////////
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}

function handleDelete(event) {
  const row = event.target.closest(".item-row");
  if (row) {
    row.remove();
    calcTotal();
    updateRowNumbers();
  }
}

function updateRowNumbers() {
  const rows = document.querySelectorAll(".item-row");
  let rowNum = 1;
  rows.forEach((row) => {
    row.querySelector(".cell0 p").textContent = rowNum++;
  });
  currentCell = rowNum - 1;
  // console.log(elePerPage);
}

addDeleteListeners();
///////////////////////////////////////////////////////////////////////////////

document.getElementById("add").addEventListener("click", addNewItem);
//////////////////////////////////////////////////
async function showInvoiceInMainPage(invoiceId) {
  try {
    const invoiceResponse = await fetch(
      `${BASE_URL}get_invoice_details/${invoiceId}`
    );
    const invoiceData = (await invoiceResponse.json()).invoice;
    const items = invoiceData.items;

    const firstItem = items[0];
    // const mainRow = document.getElementById("main-row");
    document.querySelector(".itemNameInput").value = firstItem.name;
    document.querySelector(".qty").innerText = firstItem.quantity;
    document.querySelector(".price").innerText = firstItem.price;
    document.querySelector(".total-price").innerText = firstItem.total_price;

    items.slice(1).forEach((item) => {
      addNewItem("", item.price, item.total_price, item.qty, item.name);
    });
    CUSTOMER_NAME.value = invoiceData.customer_name;
    CUSTOMER_ADDRESS.innerText = invoiceData.customer_address;
    CUSTOMER_PHONE.value = invoiceData.customer_phone;
    INVOICE_NUM.innerText = invoiceData.invoice_number;
    INVOICE_DATE.value = invoiceData.date;
    autoFillCusData();
    reSelectElements();
    lastTotal.innerText = invoiceData.totalAmount;
    lastDiscount.innerText = invoiceData.discount;
    lastAfterDiscount.innerText = invoiceData.afterDiscount;
  } catch {
    console.error("Error fetching invoice details", error);
  }
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function calculateRowTotalPrice(itemRow) {
  const qty = parseInt(itemRow.querySelector(".meter").innerText);
  const price = parseFloat(itemRow.querySelector(".price").innerText);
  const totalPriceDisplay = itemRow.querySelector(".total-price");

  // Check if all inputs are valid numbers
  if (!isNaN(qty) && !isNaN(price)) {
    const totalPrice = qty * price;
    totalPriceDisplay.innerText = totalPrice;
    calcTotal();
  } else {
    totalPriceDisplay.innerText =
      " ادخل ارقام صحيحة او املي الخانات الفارغة اصفارا";
  }
}
function attachRealTimeCalculations(itemRow) {
  // const qtyInput = itemRow.querySelector(".qty");
  const meterInput = itemRow.querySelector(".meter");
  const priceInput = itemRow.querySelector(".price");
  const totalPriceDisplay = itemRow.querySelector(".total-price");

  priceInput.addEventListener("click", function () {
    priceInput.querySelector(".c1").textContent = " ";
    // newItemPrice.querySelector(".c1").focus();
  });

  meterInput.addEventListener("click", function () {
    meterInput.querySelector(".c1").textContent = " ";
    // newItemMeter.querySelector(".c1").focus();
  });

  [meterInput, priceInput].forEach((input) => {
    input.addEventListener("input", () => {
      const meter = parseFloat(meterInput.innerText) || 0;
      const price = parseFloat(priceInput.innerText) || 0;

      if (!isNaN(meter) && !isNaN(price)) {
        const totalPrice = meter * price;
        totalPriceDisplay.innerText = totalPrice;
        calcTotal();
      } else {
        totalPriceDisplay.innerText =
          " ادخل ارقام صحيحة او املي الخانات الفارغة اصفارا";
      }
    });
  });
}
const itemRow = document.querySelector(".item-row");
attachRealTimeCalculations(itemRow);

//////////////////////////////////////////////////////////////////////
///////////////////// Save the invoice data ////////////////////////
const saveBTN = document.getElementById("save");
saveBTN.addEventListener("click", async () => {
  const itemRows = document.querySelectorAll(".item-row");
  const items = [];
  const payDebt = document.querySelector(".payDebt");
  const totalDebt = document.querySelector(".totalDebt");
  const note = document.querySelector(".note-input").value;

  console.log(lastAfterDiscount.innerText);
  console.log(payDebt.innerText);
  console.log(totalDebt.innerText);

  const formData = new FormData();
  formData.append("customer_name", CUSTOMER_NAME.value);
  formData.append("customer_address", CUSTOMER_ADDRESS.innerText);
  formData.append("customer_phone", CUSTOMER_PHONE.value);
  formData.append("invoice_number", INVOICE_NUM.innerText);
  formData.append("invoice_date", INVOICE_DATE.value);
  formData.append("invoice_total", lastTotal.innerText);
  formData.append("discount", lastDiscount.innerText);
  formData.append("after_discount", parseInt(lastAfterDiscount.innerText));
  formData.append("pay_debt", parseInt(lastPayDebt.innerText));
  formData.append("total_debt", parseInt(lastTotalDebt.innerText));
  formData.append("note", note);

  console.log(note);
  // Append item data to FormData
  itemRows.forEach((row) => {
    const cells = row.querySelectorAll(
      ".itemNameInput, .cell5, .cell6, .cell7"
    );
    const itemData = {};

    cells.forEach((cell, index) => {
      switch (index) {
        case 0:
          itemData.item_name = cell.value;
          break;
        case 1:
          itemData.qty = parseInt(cell.innerText.trim());
          break;
        case 2:
          itemData.price = parseFloat(cell.innerText.trim());
          break;
        case 3:
          itemData.total_price = parseFloat(cell.innerText.trim());
          break;
        default:
          break;
      }
    });

    items.push(itemData);
  });

  formData.append("items", JSON.stringify(items));

  axios
    .post(`${BASE_URL}post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      // getLastInvoiceNumber();
      console.log(response);
      Swal.fire({
        title: "تم حفظ البيانات بنجاح",
        icon: "success",
        confirmButtonText: "حسنا",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        title: "حدثت مشكلة اثناء الحفظ, الرجاءاعادة المحاولة",
        icon: "error",
        confirmButtonText: "حسنا",
      });
    });
});
/////////////////////////////////////WHAT'S APP////////////////////////////////////
document.getElementById("whatsApp").addEventListener("click", function () {
  let pdfData;

  // document.querySelectorAll(".itemNameInput, .clientName").forEach((input) => {
  //   input.style.textAlign = "center";
  // });
  document.querySelectorAll(".clientName").forEach((input) => {
    input.style.textAlign = "center";
  });
  // document.querySelector(".book").style.width = "309mm";
  // document.querySelector(".book").style.height = "1500px";
  // document.querySelector(".book").style.marginRight = "15px";
  document.querySelector(".book").style.marginTop = "-80px";
  // document.querySelector(".page").style.hight = "230mm";

  // if (
  //   !shouldInvokeFunction(urlParams) &&
  //   document.getElementById("datepicker")
  // ) {
  //   const originalDateInput = document.getElementById("datepicker");
  //   const invoiceDateValue = originalDateInput.value;
  //   const newDateDiv = document.createElement("div");
  //   newDateDiv.classList.add("cell2", "auto-date");
  //   const newDateParagraph = document.createElement("p");
  //   newDateParagraph.textContent = invoiceDateValue;
  //   newDateDiv.appendChild(newDateParagraph);
  //   const parentElement = originalDateInput.parentElement;
  //   parentElement.replaceChild(newDateDiv, originalDateInput);
  // }
  // window.html2canvas = html2canvas;
  // window.jsPDF = window.jspdf.jsPDF;

  html2pdf().from(document.querySelector(".book")).set().save();
  // html2pdf()
  //   .from(document.querySelector(".book"))
  //   .outputPdf("blob")
  //   .then((pdfData) => {
  //     const formData = new FormData();
  //     formData.append("pdfFile", pdfData);

  //     // Now you can use the formData object for further processing, like sending it to your backend
  //     formData.append("invoice_number", INVOICE_NUM.innerText);
  //     // revert the styling back
  //     document
  //       .querySelectorAll(".itemNameInput, .clientName")
  //       .forEach((input) => {
  //         input.style.textAlign = "right";
  //       });

  //     axios
  //       .post(`${BASE_URL}pdf`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         // getLastInvoiceNumber();
  //         console.log(response.data);
  //         let mes = response.data.message || "فشلت العملية";
  //         if (response.data.error || !response.data.message) {
  //           mes = "فشلت العملية";
  //         } else {
  //           mes = response.data.message;
  //         }
  //         let icon = response.data.num ? "success" : "error";
  //         Swal.fire({
  //           title: mes,
  //           icon: icon,
  //           confirmButtonText: "حسنا",
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   });
});
////////////////////////////////////////////////////////////////
/////////// Autocomplete customer name //////////////////////////////////////
const customerNameInput = document.querySelectorAll(".clientName");
const autocompleteResults = document.querySelectorAll(".autocomplete-results");

setupCustomerAutocomplete(customerNameInput[0], autocompleteResults[0]);

function setupCustomerAutocomplete(customerNameInput, autocompleteResults) {
  let selectedIndex = -1; // Track the selected index
  let data = null;

  customerNameInput.addEventListener("input", function () {
    const query = this.value.trim();

    if (query.length === 0) {
      autocompleteResults.innerHTML = "";
      return;
    }
    fetch(`${BASE_URL}get_client_by_name/?query=${query}`)
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData;
        console.log(data.results);
        const results = data.results;
        autocompleteResults.innerHTML = "";
        if (results.length !== 0) {
          autocompleteResults.style.display = "block";
        } else {
          autocompleteResults.style.display = "none";
        }
        selectedIndex = -1; // Reset selected index
        results.forEach((customer, i) => {
          const option = document.createElement("li");
          option.textContent = customer.customer_name;
          option.classList.add("autocompleteOption");
          option.addEventListener("click", function () {
            selectCustomer(customer);
            console.log(customer);
          });
          autocompleteResults.appendChild(option);
        });
      });
  });

  // Keyboard navigation
  customerNameInput.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      selectedIndex = Math.min(
        selectedIndex + 1,
        autocompleteResults.children.length - 1
      );
      updateSelection();
    } else if (event.key === "ArrowUp") {
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection();
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      const selectedOption = autocompleteResults.children[selectedIndex];
      if (selectedOption) {
        const customerName = selectedOption.textContent;
        const customer = findCustomerByName(customerName);
        if (customer) {
          selectCustomer(customer);
        }
      }
    }
  });

  function updateSelection() {
    const options = autocompleteResults.querySelectorAll(".autocompleteOption");
    options.forEach((option, index) => {
      if (index === selectedIndex) {
        option.classList.add("selected");
        option.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        option.classList.remove("selected");
      }
    });
  }

  function findCustomerByName(name) {
    return data.results.find((customer) => customer.customer_name === name);
  }

  function selectCustomer(customer) {
    let totalInvoiceAmount = 0;
    let totalTransactionAmount = 0;
    console.log(customer);
    customer.invoices.forEach((invoice) => {
      totalInvoiceAmount += parseFloat(invoice.after_discount);
    });
    customer.transactions.forEach((transaction) => {
      totalTransactionAmount += parseFloat(transaction.amount);
    });

    document.querySelectorAll(".clientName").forEach((ele) => {
      ele.value = customer.customer_name;
    });
    document.querySelectorAll(".clientAddress").forEach((ele) => {
      ele.innerText = customer.customer_address || " ";
    });
    document.querySelectorAll(".clientPhone").forEach((ele) => {
      ele.value = customer.customer_phone || " ";
    });
    document.querySelectorAll(".totalDebt").forEach((ele) => {
      console.log(totalTransactionAmount, totalInvoiceAmount);
      ele.innerText = totalInvoiceAmount - totalTransactionAmount;
      console.log(totalInvoiceAmount - totalTransactionAmount);
    });
    autocompleteResults.innerHTML = "";
    autocompleteResults.style.display = "none";
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest("#autocompleteResults") &&
      event.target !== customerNameInput
    ) {
      autocompleteResults.innerHTML = "";
      autocompleteResults.style.display = "none";
    }
  });
}

////////////////////////////////////////////////////////////////////////
// Dynamic Date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const dynamicDateString = `${year}/${month}/${day}`;
document.getElementById("datepicker").value = dynamicDateString;
$(function () {
  // Get current date
  var currentDate = new Date();

  $("#datepicker").datepicker({
    dateFormat: "yy/mm/dd",
    defaultDate: currentDate,
    onSelect: function (date) {},
  });
});
////////////// Get last inserted invoice number ///////////////////////////////////////
// function getLastInvoiceNumber() {
//   fetch(`${BASE_URL}get_last_invoice`)
//     .then((response) => response.json())
//     .then((data) => {
//       const lastInvoiceNumber = data.last_invoice;
//       let invoiceNumberElements;
//       invoiceNumberElements = document.querySelectorAll(".invoiceNumber");
//       invoiceNumberElements.forEach((element) => {
//         element.innerText = parseInt(lastInvoiceNumber) + 1;
//       });
//     });
// }
// getLastInvoiceNumber();
////////////////////////////////////////////////////////////////////////
// Function to find the last inserted item price for a specific item name
function getLastInsertedItemPrice(itemsArray, itemName) {
  for (let i = itemsArray.length - 1; i >= 0; i--) {
    if (itemsArray[i].item_name === itemName) {
      return itemsArray[i].price;
    }
  }
  return null;
}
// Function to return unique item names from the array
function getUniqueItemNames(itemsArray) {
  const uniqueItemNames = new Set();
  itemsArray.forEach((item) => uniqueItemNames.add(item.item_name));
  return Array.from(uniqueItemNames);
}
// Autocomplete Item Name //////////////////////////////////////////////
const itemNameInputs = document.querySelectorAll(".itemNameInput");
const itemAutocompletes = document.querySelectorAll(".itemAutocomplete");
const itemPrice = document.querySelector(".listinfo .cell6");

attachAutocompleteListener(itemNameInputs[0], itemAutocompletes[0], itemPrice);
function attachAutocompleteListener(
  itemNameInput,
  itemAutocomplete,
  itemPrice
) {
  let selectedIndex = -1; // Track the selected index
  let results = null; // Declare data variable

  itemNameInput.addEventListener("input", function () {
    const query = this.value.trim();
    if (query.length === 0) {
      itemAutocomplete.innerHTML = "";
      return;
    }

    fetch(`${BASE_URL}get_items/?query=${query}`)
      .then((response) => response.json())
      .then((responseData) => {
        const data = responseData; // Store data in the outer scope
        results = data.items;
        const items = data.items;
        const uniqueItemNames = getUniqueItemNames(items);

        if (uniqueItemNames.length !== 0) {
          itemAutocomplete.style.display = "block";
        } else {
          itemAutocomplete.style.display = "none";
        }
        selectedIndex = -1; // Reset selected index
        itemAutocomplete.innerHTML = "";
        uniqueItemNames.forEach((item, index) => {
          const option = document.createElement("div");
          option.textContent = item;
          option.classList.add("autocompleteOption");
          option.addEventListener("click", function () {
            itemNameInput.value = item;
            itemAutocomplete.innerHTML = "";
            itemAutocomplete.style.display = "none";
            itemPrice.innerText = getLastInsertedItemPrice(results, item);
            calculateRowTotalPrice(itemNameInput.parentElement.parentElement);
          });
          itemAutocomplete.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  // Handle keyboard navigation
  itemNameInput.addEventListener("keydown", function (event) {
    const itemResults = document.querySelectorAll(".autocompleteOption");
    if (itemResults.length === 0) return;

    if (event.key === "ArrowDown") {
      selectedIndex = Math.min(selectedIndex + 1, itemResults.length - 1);
    } else if (event.key === "ArrowUp") {
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (event.key === "Enter") {
      const selectedOption = document.querySelector(
        ".autocompleteOption.selected"
      );
      if (selectedOption) {
        const selectedItem = selectedOption.textContent;
        itemNameInput.value = selectedItem;
        itemAutocomplete.innerHTML = "";
        itemAutocomplete.style.display = "none";
        itemPrice.innerText = getLastInsertedItemPrice(results, selectedItem);
        calculateRowTotalPrice(itemNameInput.parentElement.parentElement);
        selectedIndex = -1;
      }
      return;
    }

    itemResults.forEach((option, index) => {
      if (index === selectedIndex) {
        option.classList.add("selected");
        option.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        option.classList.remove("selected");
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".itemAutocomplete") &&
      event.target !== itemNameInput
    ) {
      itemAutocomplete.innerHTML = "";
      itemAutocomplete.style.display = "none";
    }
  });
}
/////////////////////////////////////////////////////////////////////////////
///////////////////////////////التقرير المالي//////////////////////////////////////
