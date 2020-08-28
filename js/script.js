/*
    bookData 新增、刪除資料不改變
    只改變bookDataFromLocalStorage放在session的資料
    bookDataFromLocalStorage_len當唯一的書籍編號 新增書籍會用到
*/
var bookDataFromLocalStorage = [];
var bookDataFromLocalStorage_len = 0;
//let [database, internet, system, home, language] = ["database", "internet", "system", "home", "language"];
let [database, internet, system, home, language] = [
    { value: "database", text: "資料庫" },
    { value: "internet", text: "網際網路" },
    { value: "system", text: "應用系統整合" },
    { value: "home", text: "家庭保健" },
    { value: "language",text: "語言" }
];
$(function () {
    loadBookData();

    // 先設定.fieldlist隱藏
    var wnd = $(".fieldlist").kendoWindow({
        height: 350,
        width: 500,
        title:"新增書籍",
        visible: false,
        modal: true
    }).data("kendoWindow");

    // way 2.
    var data = [
        { text: database.text, value: database.value },
        { text: internet.text, value: internet.value  },
        { text: system.text, value: system.value  },
        { text: home.text, value: home.value  },
        { text: language.text, value: language.value  }
    ]

    /* way 1.
        var data = [
            { text: "資料庫", value: "" },
            { text: "網際網路", value: "" },
            { text: "應用系統整合", value: "" },
            { text: "家庭保健", value: "" },
            { text: "語言", value: "" }
        ]
    */

    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });

    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd"
    });
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "int" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        filterable:true,
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號", width: "10%" },
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]

    });

    // 用來判斷search框是否完全符合
    $(".book-grid-search").on('input', function () {
        // way 2. kendo filter 可做包含搜尋
        var val = $(".book-grid-search").val();
        $("#book_grid").data("kendoGrid").dataSource.filter({
            logic:"or",
            filters:[
                {
                    field:"BookId",
                    operator:"eq",
                    value:val
                },
                {
                    field: "BookName",
                    operator: "contains",
                    value:val
                },
                {
                    field: "BookCategory",
                    operator: "contains",
                    value: val
                },
                {
                    field: "BookAuthor",
                    operator: "contains",
                    value: val
                },
                {
                    field: "BookBoughtDate",
                    operator: "eq",
                    value: val
                }
            ]
        });

        /*  搜尋書籍( 可用kendo grid的fliter() )
            1. 分為 search框是 空白、非空白的狀況
                空白 ->   列出全部書籍
                非空白 -> 比對每一本書籍
            2. 每更新一次search框 -> 重新比對書籍
        */
        /* way 1. 這種搜尋只能第一個字對照第一個字
        var allSame = true;
        var result = [];
        if ($(this).val() != "") {
            let searchText = $(this).val().toLowerCase();
            for (let i = 0; i < bookDataFromLocalStorage.length; i++) {
                var bookname = bookDataFromLocalStorage[i].BookName.toLowerCase();
                allSame = true;
                for (let k = 0; k < searchText.length; k++) {
                    if (searchText[k] != bookname[k]) {
                        allSame = false;
                    }
                }
                if (allSame) {
                    result.push(bookDataFromLocalStorage[i]);
                }
            }
            // console.log(result);
            updateKandoGrid(result);

        } else { // 若搜尋框為空白 => 全部列出
            // 呼叫畫出畫面
            updateKandoGrid(bookData);
            // console.log(bookData);
        }
        */
    });



    // 觸發開啟window
    $('#addDataBtn').on('click', function() {
        wnd.center().open();
    });

    // 觸發window裡的新增
    $('#add_data').on('click', function () {
        var validator = $(".fieldlist").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            addBook(wnd);
        } else {
            alert('資料輸入不完整!');
        }
    });

});
// 新增書籍
function addBook(wnd) {
    if (confirm("確定要新增書籍嗎?")) {
        let bookCategory = $("#book_category").data("kendoDropDownList").dataItem().value;
        let bookName = $('#book_name').val();
        let author = $('#book_author').val();
        let buyDate = $('#bought_datepicker').val();
        // console.log(bookCategory);
        // console.log(bookName);
        // console.log(author);
        // console.log(buyDate);
        // 每新增一本書BookId持續累加
        bookDataFromLocalStorage_len += 1;
        const addBookItem = {
            "BookId": bookDataFromLocalStorage_len,
            "BookCategory": bookCategory,
            "BookName": bookName,
            "BookAuthor": author,
            "BookBoughtDate": buyDate,
        };
        bookDataFromLocalStorage.push(addBookItem);
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
        $("#book_grid").data('kendoGrid').dataSource.read();
        console.log(bookDataFromLocalStorage);
        resetAddBook();
        alert('新增書籍成功!');
        wnd.close();
    } else {
        return false;
    }
 }

/* 自訂 Function  */

/*  使用LocalStorage載入 book-data.js 的書籍檔案 bookData
    使用localStorage.getItem() 存入多筆 JSON 物件
    localStorage.setItem() 更新就等於新增
    localStorage.removeItem() 將整個暫存刪掉
*/
function loadBookData() {
    /*  先抓取瀏覽器的bookData 看是不是已經存入暫存了
        JSON.parse() 將資料由 JSON 格式字串轉回原本的資料內容及型別
        避免傳回奇怪的[object object]字串出來
    */
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));

    // bookDataFromLocalStorage_len = bookDataFromLocalStorage.length;
    // 若瀏覽器沒有暫存，就把它存入localStorage
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        // JSON.stringify() 將資料轉為 JSON 格式的字串
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
        // 一開始讀檔案就紀錄原始檔案的BookId
        bookDataFromLocalStorage_len = bookDataFromLocalStorage.length;
    }
}

function onChange() {
    // 抓取 kendoDropDownList 的值
    var dropdownlist = $("#book_category").data("kendoDropDownList");

    /* way 1.
    // 宣告圖片路徑
    var image_path = {
        database: "image/database.jpg",
        internet: "image/internet.jpg",
        system: "image/system.jpg",
        language: "image/language.jpg",
    }

    var dataItem = dropdownlist.dataItem().text;

    // 判斷是選哪一個text做替換圖片
    if (dataItem == "資料庫") {
        $(".book-image").attr('src',image_path.database)
    } else if (dataItem == "網際網路") {
        $(".book-image").attr('src',image_path.internet)
    } else if (dataItem == "應用系統整合") {
        $(".book-image").attr('src',image_path.internet)
    } else if (dataItem == "家庭保健") {
        $(".book-image").attr('src',image_path.system)
    } else if (dataItem == "語言") {
        $(".book-image").attr('src',image_path.language)
    }
    */

    // way 2.
    $(".book-image").attr('src',`./image/${dropdownlist.dataItem().value}.jpg`)
}

/*  target 事件屬性可返回事件的目標節點（觸發該事件的節點）
    innerHTML取得 HTML 元素或寫入字串到 HTML 網頁的語法
    innerText 則是除了可以用來取得 HTML 元素之外，還會把元素的 HTML 標籤去除掉
    (並非 W3C 所規定的標準寫法，而且僅適用於 IE 瀏覽器)
    closest('tr')
    break 離開loop
    continue 忽略此loop從下一個step開始loop
    myTrObj[0]之後選取子節點不能用jq
*/
function deleteBook(e) {
    // 讓網頁不要reload(取消該事件)，該事件仍會繼續傳遞
    e.preventDefault();
    if (confirm("確定刪除此本書?")) {
        var myTrObj = $(e.target.closest('tr'));
        var bookId = $("#book_grid").data('kendoGrid').dataItem(myTrObj).BookId;
        for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
            var localStorageBookId = bookDataFromLocalStorage[i].BookId ;
            if (localStorageBookId == bookId) {
                bookDataFromLocalStorage.splice(i, 1);
                console.log(bookDataFromLocalStorage);
                // 把刪除後的bookData重新塞回localStorage、重新讀取grid
                localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
                $("#book_grid").data('kendoGrid').dataSource.read();
                // 一次只刪除一本書，若找到此本書就不繼續loop
                break;
            }
        }
        alert('刪除書籍成功!');
    } else {
        return false;
    }


}

// 更新書籍搜尋列表 用於方法一
function updateKandoGrid(Data){
    let dataSource = new kendo.data.DataSource({
        data: Data,
        schema: {
            model: {
                fields: {
                    BookId: {type:"int"},
                    BookName: { type: "string" },
                    BookCategory: { type: "string" },
                    BookAuthor: { type: "string" },
                    BookBoughtDate: { type: "string" }
                }
            }
        },
        pageSize: 20,
        sortable: true
    });
    localStorage.setItem("bookData",JSON.stringify(Data));
    let setGrid = $("#book_grid").data("kendoGrid");
    setGrid.setDataSource(dataSource);
}

function resetAddBook() {
    $(".book-image").attr('src', `/image/${database}.jpg`)
    $('#book_name').val('');
    $('#book_author').val('');
    $('#bought_datepicker').val(kendo.toString(new Date(), "yyyy-MM-dd"));
}