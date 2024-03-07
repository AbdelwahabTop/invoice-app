<?php
defined('BASEPATH') or exit('No direct script access allowed');
?>

<!DOCTYPE html>
<html>

<head>
  <!-- CSS -->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
</head>

<body>
  <nav>
    <ul>
      <li id="print"><a href="#">طباعة</a></li>
      <li id="create"><a href="#">إنشاء صفحة جديدة</a></li>
      <li id="add"><a href="#">إضافة عنصر جديد</a></li>
      <li id="reset"><a href="#">إعادة تعيين</a></li>
      <li id="save"><button>حفظ</button></li>
    </ul>
  </nav>
  <form class="book">
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
              <div id="editable" class="cell2 clientName">
                <p>خيري ابراهيم مشتت</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>العنوان</p>
              </div>
              <!-- | -->
              <div contenteditable="true" class="cell2 clientAddress">
                <p>&nbsp;</p>
              </div>
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
              <div class="cell1">
                <p>رقم القائمة</p>
              </div>
              <!-- | -->
              <div class="cell2">
                <p>0025548</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>التاريخ</p>
              </div>
              <!-- | -->
              <div contenteditable="true" class="cell2 clientDate">
                <p>2024/9/19</p>
              </div>
            </div>
          </div>
        </div>

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
            <div contenteditable="true" class="cell2">
              <p>طول قماش قطني بازة درجة رابعة</p>
            </div>
            <div contenteditable="true" class="cell3">
              <p>99</p>
            </div>
            <div contenteditable="true" class="cell4">
              <p>100</p>
            </div>
            <div contenteditable="true" class="cell5">
              <p class="c1">3000</p>
            </div>
            <div contenteditable="true" class="cell6">
              <p class="c1">28.35.000</p>
            </div>
            <div contenteditable="true" class="cell7">
              <p>28.35.000</p>
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
              <div class="cell2">
                <p>&nbsp;</p>
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>الخصم</p>
              </div>
              <!-- | -->
              <div contenteditable="true" class="cell2">
                <input type="text" />
              </div>
            </div>

            <div class="row">
              <div class="cell1">
                <p>الحساب السابق</p>
              </div>
              <!-- | -->
              <div class="cell2">
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
  </form>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script src="<?php echo base_url(); ?>assets/scripts/main.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    // Get all <a> elements
    var links = document.querySelectorAll("a");

    // Add click event listener to each link
    links.forEach(function(link) {
      link.addEventListener("click", function(event) {
        event.preventDefault();
      });
    });
  });
</script>

</html>