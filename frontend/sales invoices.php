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
      <li id=""><a href="#" style="color: #84f087;">إِنشاء فاتورة <i class="fa-solid fa-receipt" style="color: #84f087;"></i></a></li>
      <li id="route"><a href="#">عرض الفواتير <i class="fa-solid fa-table" style="color: #ffffff;"></i></a></li>
      <li id="report-page"><a href="#">التقرير المالي <i class="fa-solid fa-file-invoice-dollar" style="color: #ffffff;"></i></a></li>
      <li id="debt-page"><a href="#">التسديدات <i class="fa-solid fa-file-invoice-dollar" style="color: #ffffff;"></i></a></li>
      <li id="reset"><a href="#">إعادة تعيين <i class="fa-sharp fa-solid fa-rotate fa-spin" style="color: #ffffff;"></i></a></li>
      <li id="print"><a href="#">طباعة  <i class="fa-solid fa-print" style="color: #ffffff;"></i></a></li>
      <li id="create"><a href="#">إنشاء صفحة جديدة  <i class="fa-solid fa-file-circle-plus" style="color: #ffffff;"></i></a></li>
      <li id="add"><a href="#">إضافة عنصر جديد  <i class="fa-solid fa-circle-plus" style="color: #ffffff;"></i></a></li>
      <!-- <li id="save"><a href="#">حفظ</a></li> -->
      <li id="save"><button>حفظ</button></li>
      <li id="whatsApp"><button>أرسال واتساب <i class="fa-brands fa-whatsapp" style="color: #ffffff;"></i></button></li>
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
              <input type="text" id="NAME" autocomplete="off" class="cell2 clientName" placeholder="....أكتب اسم العميل الثلاثي" />
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
            <!-- <div class="cell4">
              <p>ســم</p>
            </div> -->
            <div class="cell5">
              <p>متــر</p>
            </div>
            <div class="cell6">
              <p>ســعر المتر</p>
            </div>
            <div class="cell7">
              <p>المبلغ الكلــي</p>
            </div>
            <div class="cell8">
              <p>حذف</p>
            </div>
          </div>
        </div>
        <div class="listinfo open" id="itemContainer">
          <!-- تفاصيل القائمة ------------------------------------------------------>

          <div class="row item-row" id="main-row">
            <div class="cell0">
              <p>1</p>
            </div>
            <div>
              <input type="text" autocomplete="off" class="itemNameInput" placeholder="...أكتب اسم السلعة" />
            </div>
            <ul class="itemAutocomplete"></ul>
            <div contenteditable="true" class="cell3 qty">
              <p>1</p>
            </div>
            <!-- <div class="cell4 cm">
              <p>00</p>
            </div> -->
            <div contenteditable="true" class="cell5 meter">
              <p class="c1">00.00</p>
            </div>
            <div contenteditable="true" class="cell6 price">
              <p class="c1">00.00</p>
            </div>
            <div class="cell7 total-price">
              <p>00.00</p>
            </div>
            <div class="cell8 delete">
              <i class="fa-solid fa-trash-can" style="color: #f20d0d;"></i>            
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
                <p>المبلغ بعد الخصم</p>
              </div>
              <!-- | -->
              <div class="cell2 after-discount">
                <p>&nbsp;</p>
              </div>
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
    </div>
  </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script type="module" src="scripts/main.js"></script>

</html>