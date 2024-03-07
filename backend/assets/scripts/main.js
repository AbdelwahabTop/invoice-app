document.getElementById("print").addEventListener("click", function () {
  // Code to handle print functionality
  print();
  console.log("print");
});

function createNewPage(num) {
  const clientName = document.querySelector(".row .clientName").innerHTML;
  const address = document.querySelector(".row .clientAddress").innerHTML;
  const clientDate = document.querySelector(".row .clientDate").innerHTML;
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
          <div class="cell1"><p>حضرة السيد</p></div>
          <!-- | -->
          <div contenteditable="true" id="editable" class="cell2"><p>${clientName}</p></div>
        </div>

        <div class="row">
          <div class="cell1"><p>العنوان</p></div>
          <!-- | -->
          <div contenteditable="true" class="cell2"><p>${address}</p></div>
        </div>
      </div>
      <script>
        var editable = document.getElementById("editable");
        editable.contentEditable = true;
        var text = editable.innerHTML;
        text = text.replace(/test/g, '<span class="red">Prank</span>');
        editable.innerHTML = text;
      </script>

      <div class="navl">
        <!-- معلومات القائمة ------------------------------------------------------->
        <div class="row">
          <div class="cell1"><p>رقم القائمة</p></div>
          <!-- | -->
          <div class="cell2"><p>00${Math.floor(
            Math.random() * 100000
          )}</p></div>
        </div>

        <div class="row">
          <div class="cell1"><p>التاريخ</p></div>
          <!-- | -->
          <div contenteditable="true" class="cell2"><p>${clientDate}</p></div>
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
          <div class="cell2"><p>&nbsp;</p></div>
        </div>

        <div class="row">
          <div class="cell1"><p>الخصم</p></div>
          <!-- | -->
          <div contenteditable="true" class="cell2"><input type="text" /></div>
        </div>

        <div class="row">
          <div class="cell1"><p>الحساب بعد الخصم</p></div>
          <!-- | -->
          <div class="cell2"><p>&nbsp;</p></div>
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

function generateItemRow(colNum) {
  let content = `<div class="row item-row">
    <div class="cell0"><p>${colNum}</p></div>
    <div contenteditable="true" class="cell2">
      <p>طول قماش قطني بازة درجة رابعة</p>
    </div>
    <div contenteditable="true" class="cell3"><p>99</p></div>
    <div contenteditable="true" class="cell4"><p>100</p></div>
    <div contenteditable="true" class="cell5">
      <p class="c1">3000</p>
    </div>
    <div contenteditable="true" class="cell6">
      <p class="c1">28.35.000</p>
    </div>
    <div contenteditable="true" class="cell7"><p>28.35.000</p></div>
  </div>`;

  return content;
}
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
      parent.innerHTML += generateItemRow(currentCell);
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

const calcTotal = () => {
  let total = 0;
  for (let i = 0; i < elePerPage.length; i++) {
    const rowsItems = document
      .querySelector(containerID + i)
      .querySelectorAll(".item-row .cell7 p");
    rowsItems.forEach((item) => {
      total += parseFloat(item.innerHTML);
    });
  }
  return total;
};

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
// reset all values to zero in the last ele
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

const saveBTN = document.getElementById("save");

saveBTN.addEventListener("click", async () => {
  const formData = new FormData();

  // Get client name
  const clientName = document.querySelector(".clientName").innerText;
  formData.append("client_name", clientName.trim());

  // Get client address
  const clientAddress = document.querySelector(".clientAddress").innerText;
  formData.append("client_address", clientAddress.trim());

  // Get client date
  const invoiceDate = document.querySelector(".clientDate").innerText;
  formData.append("client_date", invoiceDate.trim());

  // Get list items
  const itemRows = document.querySelectorAll(".item-row");
  itemRows.forEach((row, index) => {
    const cells = row.querySelectorAll(
      ".cell2, .cell3, .cell4, .cell5, .cell6, .cell7"
    );
    cells.forEach((cell, cellIndex) => {
      formData.append(`item_${index}_${cellIndex}`, cell.innerText.trim());
    });
  });

  const baseUrl = "<?php echo base_url(); ?>"; // Get the base URL dynamically
  const invoiceUrl = baseUrl + "application/controllers/LionInvoices/insert"; // Append the dynamic part of the URL
  // Send the form data
  await axios.post(invoiceUrl, formData);
});
