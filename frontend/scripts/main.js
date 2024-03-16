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

const BASE_URL = "http://localhost/files/backend/";
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
          <div class="cell1"><p>الواصل</p></div>
          <!-- | -->
          <div class="cell2"><p>&nbsp;</p></div>
        </div>

        <div class="row">
          <div class="cell1"><p>المتبقي</p></div>
          <!-- | -->
          <div class="cell2"><p>&nbsp;</p></div>
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
  invTotalSec.forEach((ele) => {
    ele.innerText = " ";
  });
  discountEles.forEach((ele) => {
    ele.innerText = " ";
  });
  afterDiscountEles.forEach((ele) => {
    ele.innerText = "";
  });
  lastDiscount.innerText = discountNum;

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
  lastTotal.innerText = total.toFixed(2);
  if (total >= parseFloat(lastDiscount.innerText)) {
    lastAfterDiscount.innerText =
      total.toFixed(2) - parseFloat(lastDiscount.innerText).toFixed(2);
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
      let parent = document
        .querySelector(containerID + i)
        .querySelector(".center")
        .querySelector(`#itemContainer`);

      let currentCell = elePerPage.reduce((acc, currVal) => {
        return acc + currVal;
      }, 0);

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
    <div class="cell4 cm"><p>00</p></div>
    <div class="cell5 meter">
      <p class="c1">00</p>
    </div>
    <div contenteditable="true" class="cell6 price">
      <p class="c1">${price}</p>
    </div>
    <div class="cell7 total-price"><p>${totalPrice}</p></div>
  </div>`;

  // Create a temporary div element to attach the new row
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const newItemRow = tempDiv.firstElementChild;

  // Attach event listener to the autocomplete input field of the new row

  const newItemNameInput = newItemRow.querySelector(".itemNameInput");

  const newItemAutocomplete = newItemRow.querySelector(".itemAutocomplete");
  const newItemPrice = newItemRow.querySelector(".cell6");
  attachAutocompleteListener(
    newItemNameInput,
    newItemAutocomplete,
    newItemPrice
  );
  attachRealTimeCalculations(newItemRow);

  return newItemRow;
}

document.getElementById("add").addEventListener("click", addNewItem);
//////////////////////////////////////////////////
async function showInvoiceInMainPage(invoiceId) {
  try {
    const invoiceResponse = await fetch(
      `${BASE_URL}get_invoice_details/${invoiceId}`
    );
    const invoiceData = (await invoiceResponse.json()).invoice;
    const items = invoiceData.items;

    items.forEach((item) => {
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
  const qty = parseInt(itemRow.querySelector(".qty").innerText);
  const price = parseFloat(itemRow.querySelector(".price").innerText);
  const totalPriceDisplay = itemRow.querySelector(".total-price");

  // Check if all inputs are valid numbers
  if (!isNaN(qty) && !isNaN(price)) {
    const totalPrice = qty * price;
    totalPriceDisplay.innerText = totalPrice.toFixed(2);
    calcTotal();
  } else {
    totalPriceDisplay.innerText =
      " ادخل ارقام صحيحة او املي الخانات الفارغة اصفارا";
  }
}
function attachRealTimeCalculations(itemRow) {
  const qtyInput = itemRow.querySelector(".qty");
  const priceInput = itemRow.querySelector(".price");
  const totalPriceDisplay = itemRow.querySelector(".total-price");

  [qtyInput, priceInput].forEach((input) => {
    input.addEventListener("input", () => {
      const qty = parseInt(qtyInput.innerText) || 0;
      const price = parseFloat(priceInput.innerText) || 0;

      if (!isNaN(qty) && !isNaN(price)) {
        const totalPrice = qty * price;
        totalPriceDisplay.innerText = totalPrice.toFixed(2);
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

  let pdfData;

  window.html2canvas = html2canvas;
  window.jsPDF = window.jspdf.jsPDF;

  document.querySelectorAll(".itemNameInput, .clientName").forEach((input) => {
    input.style.textAlign = "center";
  });
  document.querySelector(".book").style.width = "309mm";
  document.querySelector(".book").style.height = "auto";
  document.querySelector(".book").style.margin = "auto";

  if (
    !shouldInvokeFunction(urlParams) &&
    document.getElementById("datepicker")
  ) {
    const originalDateInput = document.getElementById("datepicker");
    console.log(originalDateInput);
    const invoiceDateValue = originalDateInput.value;
    const newDateDiv = document.createElement("div");
    newDateDiv.classList.add("cell2", "auto-date");
    const newDateParagraph = document.createElement("p");
    newDateParagraph.textContent = invoiceDateValue;
    newDateDiv.appendChild(newDateParagraph);
    const parentElement = originalDateInput.parentElement;
    parentElement.replaceChild(newDateDiv, originalDateInput);
  }

  html2canvas(document.querySelector(".book"), {
    scale: 1,
    allowTaint: true,
    useCORS: true,
  }).then((canvas) => {
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;
    const pdfWidth = 210;
    const pdfHeight = pdfWidth / aspectRatio;

    var img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.setFontSize(25);

    const blob = pdf.output("blob");

    pdfData = new Blob([blob], { type: "application/pdf" });

    const formData = new FormData();
    formData.append("pdfFile", pdfData);

    // revert the styling back
    document
      .querySelectorAll(".itemNameInput, .clientName")
      .forEach((input) => {
        input.style.textAlign = "right";
      });

    formData.append(
      "customer_name",
      CUSTOMER_NAME.value || "لم يتم تسجيل اسم العميل"
    );
    formData.append("customer_address", CUSTOMER_ADDRESS.innerText);
    formData.append("customer_phone", CUSTOMER_PHONE.value);
    formData.append("invoice_number", INVOICE_NUM.innerText);
    formData.append("invoice_date", INVOICE_DATE.value);
    formData.append("invoice_total", lastTotal.innerText);
    formData.append("discount", lastDiscount.innerText);
    formData.append("after_discount", lastAfterDiscount.innerText);

    // Append item data to FormData
    itemRows.forEach((row) => {
      const cells = row.querySelectorAll(
        ".itemNameInput, .cell3, .cell6, .cell7"
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (!shouldInvokeFunction(urlParams)) {
      getLastInvoiceNumber();
    }
  });
});
////////////////////////////////////////////////////////////////
/////////// Autocomplete customer name //////////////////////////////////////
const customerNameInput = document.querySelectorAll(".clientName");
const autocompleteResults = document.querySelectorAll(".autocomplete-results");

setupCustomerAutocomplete(customerNameInput[0], autocompleteResults[0]);

function setupCustomerAutocomplete(customerNameInput, autocompleteResults) {
  customerNameInput.addEventListener("input", function () {
    const query = this.value.trim();

    if (query.length === 0) {
      autocompleteResults.innerHTML = "";
      return;
    }
    fetch(`${BASE_URL}get_client_by_name/?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        autocompleteResults.innerHTML = "";
        if (results.length !== 0) {
          autocompleteResults.style.display = "block";
        } else {
          autocompleteResults.style.display = "none";
        }
        results.forEach((customer, i) => {
          const option = document.createElement("li");
          option.textContent = customer.customer_name;
          option.classList.add("autocompleteOption");
          option.addEventListener("click", function () {
            // customerNameInput.value = customer.customer_name;
            document.querySelectorAll(".clientName").forEach((ele) => {
              ele.value = customer.customer_name;
            });
            document.querySelectorAll(".clientAddress").forEach((ele) => {
              ele.innerText = customer.customer_address || " ";
            });
            document.querySelectorAll(".clientPhone").forEach((ele) => {
              ele.value = customer.customer_phone || " ";
            });
            autocompleteResults.innerHTML = "";
          });
          autocompleteResults.appendChild(option);
        });
      });
  });

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
function getLastInvoiceNumber() {
  fetch(`${BASE_URL}get_last_invoice`)
    .then((response) => response.json())
    .then((data) => {
      const lastInvoiceNumber = data.last_invoice;
      let invoiceNumberElements;
      invoiceNumberElements = document.querySelectorAll(".invoiceNumber");
      invoiceNumberElements.forEach((element) => {
        element.innerText = parseInt(lastInvoiceNumber) + 1;
      });
    });
}
getLastInvoiceNumber();
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
  itemNameInput.addEventListener("input", function () {
    const query = this.value.trim();
    if (query.length === 0) {
      itemAutocomplete.innerHTML = "";
      return;
    }

    fetch(`${BASE_URL}get_items/?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const items = data.items;
        const uniqueItemNames = getUniqueItemNames(items);

        if (uniqueItemNames.length !== 0) {
          itemAutocomplete.style.display = "block";
        } else {
          itemAutocomplete.style.display = "none";
        }
        itemAutocomplete.innerHTML = "";
        uniqueItemNames.forEach((item) => {
          const option = document.createElement("div");
          option.textContent = item;
          option.classList.add("autocompleteOption");
          option.addEventListener("click", function () {
            itemNameInput.value = item;
            itemAutocomplete.innerHTML = "";
            itemAutocomplete.style.display = "none";
            itemPrice.innerText = getLastInsertedItemPrice(items, item);
            calculateRowTotalPrice(itemNameInput.parentElement.parentElement);
          });
          itemAutocomplete.appendChild(option);
        });
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
