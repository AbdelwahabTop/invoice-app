document.getElementById("print").addEventListener("click", function () {
  // Code to handle print functionality
  print();
  console.log("print");
});

const BASE_URL = "http://localhost/files/backend/";
const CUSTOMER_NAME = document.getElementById("NAME");
const CUSTOMER_ADDRESS = document.getElementById("ADDRESS");
const CUSTOMER_PHONE = document.getElementById("PHONE");
const INVOICE_NUM = document.getElementById("INV-NUM");
const INVOICE_DATE = document.getElementById("datepicker");

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
        <div class="name-num">
          <input readonly value="${CUSTOMER_NAME.value}" type="text" class="cell2 clientName auto-name" placeholder="....أكتب اسم العميل الثلاثي" />
          <input readonly value="${CUSTOMER_PHONE.value}" type="text" class="clientPhone auto-phone" placeholder="أدخل رقم الهاتف..." />
        </div>
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
          <div class="cell1"><p>التاريخ</p></div>
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
          <div id="tot-${num}-tot" class="cell2 total"><p>&nbsp;</p></div>
        </div>

        <div class="row">
          <div class="cell1 discount"><p>الخصم</p></div>
          <!-- | -->
          <div contenteditable="true" class="cell2"><input type="text" /></div>
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

  autoFillCusData();
  calcTotal();
  discount();
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

document.getElementById("create").addEventListener("click", function () {
  elePerPage.push(0);
  createNewPage(elePerPage.length - 1);
});

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

const changeTotalPerPage = (pageNum) => {
  document.querySelector(containerID + (elePerPage.length - 1));
  if (elePerPage.length == 1) {
    // console.log(document.querySelector(containerID + (elePerPage.length - 1)));
    const test = getElementByXpath(
      `/html/body/div/div[@id="page${pageNum}"]/div[3]/div/div[2]/div[1]/div[2]/p`,
      document
    );

    test.innerHTML = Math.floor(calcTotal());
  } else {
    const lastEle = getElementByXpath(
      `/html/body/div/div[@id="page${
        pageNum - 1
      }"]/div[3]/div/div[2]/div[1]/div[2]/p`,
      document
    );
    lastEle.innerHTML = "";
    const newEle = getElementByXpath(
      `/html/body/div/div[@id="page${pageNum}"]/div[3]/div/div[2]/div[1]/div[2]/p`,
      document
    );
    newEle.innerHTML = Math.floor(calcTotal());
  }
};

document.getElementById("add").addEventListener("click", function () {
  if (currentPage === null || currentItemCount >= maximumItemsPerPage) {
    elePerPage.push(0);
    createNewPage(elePerPage.length - 1);
    applyListnerOnCut(elePerPage.length - 1);
    clearLast(elePerPage.length - 2);
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

      console.log(elePerPage.length - 1);
      // parent.innerHTML += generateItemRow(currentCell);
      parent.append(generateItemRow(currentCell));
      changeTotalPerPage(elePerPage.length - 1);
      handelDomChange(elePerPage.length - 1);
      break;
    }
  }

  currentItemCount++;

  // Check if the current page is full after adding the item
  if (currentItemCount >= maximumItemsPerPage) {
    // If full, set currentPage to null to trigger creation of a new page on next item addition
    currentPage = null;
  }
});

document.getElementById("reset").addEventListener("click", function () {
  // Code to handle resetting
  location.reload();
  console.log("reset");
});

/////////////////////////////////////////////////////
const invTotalSec = document.querySelectorAll(".total");
const lastTotal = invTotalSec[invTotalSec.length - 1];

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
  invTotalSec.forEach((ele) => {
    ele.innerText = " ";
  });
  lastTotal.innerText = total;
  // console.log(total);
  return total;
};

const discount = () => {
  const discountEles = document.querySelectorAll(".discount");
  const afterDiscountEles = document.querySelectorAll(".after-discount");
  discountEles.forEach((ele) => {
    ele.innerText = " ";
  });
  afterDiscountEles.forEach((ele) => {
    ele.innerText = " ";
  });
  const lastDiscount = discountEles[discountEles.length - 1];
  const lastAfterDiscount = afterDiscountEles[afterDiscountEles.length - 1];

  lastDiscount.addEventListener("input", (e) => {
    const total = calcTotal();
    console.log(lastDiscount.innerText);
    if (total >= parseFloat(lastDiscount.innerText)) {
      const afterDiscount = total - lastDiscount.innerText;
      console.log(afterDiscount);
      lastAfterDiscount.innerText = afterDiscount;
    } else if (total < parseFloat(lastDiscount.innerText)) {
      lastAfterDiscount.innerText = "الخصم اكبر من المجموع";
    } else {
      lastAfterDiscount.innerText = lastDiscount.innerText;
    }
  });
  // console.log("discount");
};

function attachRealTimeCalculations(itemRow) {
  const qtyInput = itemRow.querySelector(".qty");
  const cmInput = itemRow.querySelector(".cm");
  const meterInput = itemRow.querySelector(".meter");
  const priceInput = itemRow.querySelector(".price");
  const totalPriceDisplay = itemRow.querySelector(".total-price");

  [qtyInput, cmInput, meterInput, priceInput].forEach((input) => {
    input.addEventListener("input", () => {
      const qty = parseInt(qtyInput.innerText);
      const cm = parseInt(cmInput.innerText);
      const meter = parseInt(meterInput.innerText);
      const price = parseFloat(priceInput.innerText);

      // Check if all inputs are valid numbers
      if (!isNaN(qty) && !isNaN(cm) && !isNaN(meter) && !isNaN(price)) {
        let totalCm = cm;
        let totalMeter = meter;

        if (totalCm >= 100) {
          totalMeter += Math.floor(totalCm / 100);
          totalCm %= 100;
        }

        let meterCmString = totalMeter.toString();
        if (totalCm > 0) {
          meterCmString += "." + totalCm.toString().padStart(2, "0");
        }

        const totalPrice = qty * parseFloat(meterCmString) * price;
        totalPriceDisplay.innerText = totalPrice;
        calcTotal();
      } else {
        totalPriceDisplay.innerText = "Invalid";
      }
    });
  });
}
const itemRow = document.querySelector(".item-row");
attachRealTimeCalculations(itemRow);

// this listner is reponsable of adding the price cut and change the total after but
function applyListnerOnCut(pageNum) {
  // retrive the input we will add the number of price cut on
  let ele = getElementByXpath(
    `/html/body/div/div[@id="page${pageNum}"]/div[3]/div/div[2]/div[2]/div[2]/input`,
    document
  );
  ele.addEventListener("input", (e) => {
    handelDomChange(pageNum);
  });
}

function handelDomChange(pageNum) {
  const e = getElementByXpath(
    `/html/body/div/div[@id="page${pageNum}"]/div[3]/div/div[2]/div[2]/div[2]/input`,
    document
  );
  const valueOfInput = e.value;
  // this is the parent
  const parent = e.parentElement.parentElement.parentElement;
  const total = getElementByXpath(
    "div[2]/p",
    getElementByXpath("div[1]", parent)
  ).innerHTML;
  const afterSalecut = getElementByXpath(
    "div[2]/p",
    getElementByXpath("div[3]", parent)
  );
  afterSalecut.innerHTML = parseFloat(total) - valueOfInput;
}
//////////////// reset all values to zero in the last ele
function clearLast(pageNum) {
  let ele = getElementByXpath(
    `/html/body/div/div[@id="page${pageNum}"]/div[3]/div/div[2]/div[2]/div[2]/input`,
    document
  );
  const parent = ele.parentElement.parentElement.parentElement;
  ele.value = "";
  const total = getElementByXpath(
    "div[2]/p",
    getElementByXpath("div[1]", parent)
  ).innerHTML;
  total.innerHTML = "";
  const afterSalecut = getElementByXpath(
    "div[2]/p",
    getElementByXpath("div[3]", parent)
  );
  afterSalecut.innerHTML = "";
  applyListnerOnCut;
}
applyListnerOnCut(0);
//////////////////////////////////////////////////////////////////////
// Save the invoice data, client details and items to the database
const saveBTN = document.getElementById("save");
saveBTN.addEventListener("click", async () => {
  const itemRows = document.querySelectorAll(".item-row");
  const items = [];

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

  const Data = {
    customer_name: CUSTOMER_NAME.value,
    customer_address: CUSTOMER_ADDRESS.innerText,
    customer_phone: CUSTOMER_PHONE.value,
    invoice_number: INVOICE_NUM.innerText,
    invoice_date: INVOICE_DATE.value,
    items,
  };

  console.log(Data);
  await axios
    .post(`${BASE_URL}post`, JSON.stringify(Data))
    .then((response) => {
      console.log(response.data);
      getLastInvoiceNumber();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

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
    fetch(`${BASE_URL}get_client/?query=${query}`)
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
            customerNameInput.value = customer.customer_name;
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
        console.log(uniqueItemNames);
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
            itemPrice.innerHTML = getLastInsertedItemPrice(items, item);
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

// Function to generate a new item row
function generateItemRow(colNum) {
  let content = `<div class="row item-row">
    <div class="cell0"><p>${colNum}</p></div>
    <div>
    <input type="text" class="itemNameInput" placeholder="...أكتب اسم السلعة">
  </div>
  <ul class="itemAutocomplete"></ul>
    <div contenteditable="true" class="cell3 qty"><p>1</p></div>
    <div contenteditable="true" class="cell4 cm"><p>00</p></div>
    <div contenteditable="true" class="cell5 meter">
      <p class="c1">00</p>
    </div>
    <div contenteditable="true" class="cell6 price">
      <p class="c1">00.00</p>
    </div>
    <div class="cell7 total-price"><p>00.00</p></div>
  </div>`;

  // Create a temporary div element to attach the new row
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const newItemRow = tempDiv.firstChild;

  // Attach event listener to the autocomplete input field of the new row
  const newItemNameInput = newItemRow.querySelector(".itemNameInput");
  const newItemAutocomplete = newItemRow.querySelector(".itemAutocomplete");
  const newItemPrice = newItemRow.querySelector(".cell6");
  attachAutocompleteListener(
    newItemNameInput,
    newItemAutocomplete,
    newItemPrice
  );
  // Attach real-time calculations to the new row
  attachRealTimeCalculations(newItemRow);

  return newItemRow;
}
discount();
