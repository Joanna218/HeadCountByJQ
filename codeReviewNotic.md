# WorkShop3
1. 新增書籍時的書籍圖片 onChange事件
  - 有什麼辦法可以不用if判斷，只要寫一行code就可?
  - 不可用data裡的text去做if判斷，使用中文判斷，日後系統維護會有很大的問題
2. 新增書籍:
  - 要顯示警示視窗
  - 取值通常都是取value，不會取text
  - 新增書籍後，要把欄位reset
  - bookId該如何給?
  - 若沒輸入完整資料，不能給user新增(kendo 驗證)
  - 購買日期要做驗證只能輸入日期(加分題)

3. 刪除書籍:
  - 要顯示警示視窗
  - 請使用kendo.dataItem()去拿到bookId，不可使用陣列取得
  - 若刪除其中一本書籍，再新增一本書，看bookId是否還是流水號下來
4. 搜尋書籍:
  - jq綁定要綁在input上，檢查是否可以用貼上文字的方式搜尋
  - 使用kendo filter做搜尋，有包含的字都會被搜尋出來(所有欄位都可當作搜尋目標)

## javascript大通則
  1. 命名規則與大小需統一
  2. 原生js與Jquery不可混著使用

## Kendo Filter
- logic是dataSource與下方的filter做整層的資料篩選
- filter中，每一個operator是做自己的邏輯判斷
- logic用and，filter只能用contains，不能用eq會篩選不到
- filter若是用and，每一個filter的條件都要符合才篩選的到，若是用or就滿足一個就全部篩選的到
- 例如: 書名、類別operator都給contains，若是and，要資料庫才篩選的到(兩個都符合)，若是or，資料庫或書名都篩的到

## 解構賦值
- 原理像鏡子映射一樣，映射順序一個對映一個
- 用在兩個變數交換超方便，他是同時交換!
- 範例:
<!--
  let Goku = '悟空';
  let Ginyu = '基紐';
  [Goku, Ginyu] = [Ginyu, Goku];
  Goku: '基紐'
  Ginyu: '悟空'
-->