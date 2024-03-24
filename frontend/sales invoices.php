<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <!-- CSS -->
  <link rel="stylesheet" type="text/css" href="css/style.css" />

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.0/jspdf.umd.min.js"></script>
  <script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>

  <style type="text/css" media="print">
    .no-print {
      display: none;
    }
  </style>
</head>

<body>
  <nav class="no-print">
    <ul>
      <li id=""><a href="#" style="color: #84f087;">إِنشاء فاتورة</a></li>
      <li id="route"><a href="#">عرض الفواتير</a></li>
      <li id="report-page"><a href="#">التقرير المالي</a></li>
      <li id="reset"><a href="#">إعادة تعيين</a></li>
      <li id="print"><a href="#">طباعة</a></li>
      <li id="create"><a href="#">إنشاء صفحة جديدة</a></li>
      <li id="add"><a href="#">إضافة عنصر جديد</a></li>
      <!-- <li id="save"><a href="#">حفظ</a></li> -->
      <li id="save"><button>حفظ</button></li>
    </ul>
  </nav>
  <div class="book">
    <div class="page" id="page0">
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
              <input type="text" id="NAME" class="cell2 clientName" placeholder="....أكتب اسم العميل الثلاثي" />
              <div class="cell1">
                <p>الهاتف</p>
              </div>
              <input type="text" id="PHONE" class="clientPhone" placeholder="أدخل رقم الهاتف..." />
            </div>

            <div class="row">
              <div class="cell1">
                <p>العنوان</p>
              </div>
              <!-- | -->
              <div contenteditable="true" class="cell2 clientAddress" id="ADDRESS">
                <p>&nbsp;</p>
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
              <div contenteditable="true" class="cell2 invoiceNumber" id="INV-NUM">
                <p>0025548</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>التاريخ</p>
              </div>
              <!-- | -->
              <div class="cell2 clientDate">
                <input type="text" id="datepicker" placeholder="Select Date" />
              </div>
            </div>
          </div>
        </div>
        <ul id="autocompleteResults" class="autocomplete-results"></ul>

        <div class="list">
          <!-- تصنيف القائمة ------------------------------------------------------>
          <div class="row">
            <div class="cell0">
              <p>ت</p>
            </div>
            <div class="cell2">
              <p>التفـــــاصيــــل</p>
            </div>
            <div class="cell3">
              <p>الكمية</p>
            </div>
            <div class="cell4">
              <p>ســم</p>
            </div>
            <div class="cell5">
              <p>متــر</p>
            </div>
            <div class="cell6">
              <p>ســعر الجملة</p>
            </div>
            <div class="cell7">
              <p>المبلغ الكلــي</p>
            </div>
          </div>
        </div>
        <div class="listinfo open" id="itemContainer">
          <!-- تفاصيل القائمة ------------------------------------------------------>

          <div class="row item-row">
            <div class="cell0">
              <p>1</p>
            </div>
            <div>
              <input type="text" class="itemNameInput" placeholder="...أكتب اسم السلعة" />
            </div>
            <ul class="itemAutocomplete"></ul>
            <div contenteditable="true" class="cell3 qty">
              <p>1</p>
            </div>
            <div class="cell4 cm">
              <p>00</p>
            </div>
            <div class="cell5 meter">
              <p class="c1">00</p>
            </div>
            <div contenteditable="true" class="cell6 price">
              <p class="c1">00.00</p>
            </div>
            <div class="cell7 total-price">
              <p>00.00</p>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="price">
          <!-- مجموع الاسعار والخصم والباقي  ------------------------------------------------------->
          <div class="navr">
            <div class="row">
              <div class="note">
                <p>
                  الملاحظات :&nbsp;&nbsp;<span style="font-weight: 400">تم ارسال البضاعة بواسطة شركة اور لتوصيل السريع</span>
                </p>
              </div>
            </div>
          </div>

          <div class="navl">
            <div class="row">
              <div class="cell1">
                <p>مجموع القائمة</p>
              </div>
              <!-- | -->
              <div class="cell2 total">
                <p>&nbsp;</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>الخصم</p>
              </div>
              <!-- | -->
              <div contenteditable="true" class="cell2 discount">
                <p>00.00</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>الحساب السابق</p>
              </div>
              <!-- | -->
              <div class="cell2 after-discount">
                <p>&nbsp;</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>الواصل</p>
              </div>
              <!-- | -->
              <div class="cell2">
                <p>&nbsp;</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>المتبقي</p>
              </div>
              <!-- | -->
              <div class="cell2">
                <p>&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script type="module" src="scripts/main.js"></script>

</html>