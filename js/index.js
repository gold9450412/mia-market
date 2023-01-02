window.onload = function()
{
    //聲明一個紀錄點擊縮略圖下標
    var bigimgIndex = 0;
    /**
     * 1. 先獲得頁面元素 (navPath)
     * 2. 獲取數據 (data.js -> goodData.path)
     * 3. 遍歷數據，數據是動態的，相應的DOM也必須動態產生，需要創建DOM元素 (根據數據的數量)
     * 4. 創建標籤，而最後一個DOM元素，只創建a標籤，不創建i標籤
     */
    navPathDataBind();
    //路徑導航的數據渲染
    function navPathDataBind()
    {
        // 1. 先獲得頁面元素 (navPath)
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');
        // 2. 獲取數據 (data.js -> goodData.path)
        var path = goodData.path;
        // 3. 遍歷數據，數據是動態的，相應的DOM也必須動態產生，需要創建DOM元素 (根據數據的數量)
        for (var i = 0; i<path.length; i++)
        {
            // 最後一個不追加i元素及href
            if (i == path.length-1)
            {
                var aNode = document.createElement('a'); 
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            }
            else
            {
                // 4. 創建標籤，而最後一個DOM元素，只創建a標籤，不創建i標籤
                var aNode = document.createElement('a');
                aNode.href = path[i].url;
                // innerText和innerHTML不同，Text是顯示文字，HTML是整個標籤含內容
                aNode.innerText = path[i].title;
                // 創建i標籤
                var iNode = document.createElement('i');
                iNode.innerText = '/';
                // 追加剛剛添加的元素
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
        }    
        }
    }

    /**
     * 1. 獲取小圖框元素對象，並且設置移入事件 (onmouseover, onmouseenter)
     *  onmouseover: 有冒泡效果，會影響父元素。 onmouseenter則無，所以我們選onmouseenter
     * 2. 動態創建蒙版及大圖框、大圖片元素
     * 3. 移除時(onmouseleave)，移除蒙版、大圖框、大圖片元素
    */
    bigClassBind();
    //放大鏡的移入移出效果
    function bigClassBind()
    {   //1. 獲取小圖框元素對象，並且設置移入事件 (onmouseover, onmouseenter)
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');  
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        var imagessrc = goodData.imagessrc;

        smallPic.onmouseenter = function()
        {
            // 2. 動態創建蒙版及大圖框、大圖片元素
            // 創建蒙版
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //創建大圖框元素
            var BigPic = document.createElement('div');
            BigPic.id = 'bigPic';

            //創建大圖片元素
            var BigImg = document.createElement('img');

            //必須等於點擊時的下標
            BigImg.src = imagessrc[bigimgIndex].b;

            //大圖框 追加 子元素大圖片
            BigPic.appendChild(BigImg);

            //小圖框追加蒙版
            smallPic.appendChild(maskDiv);

            //leftTop追加大圖框
            leftTop.appendChild(BigPic);

            //設置移動事件
            smallPic.onmousemove = function(event)
            {
                //event.clientX鼠標到瀏覽器最左側的點
                //getBoundingClientRect().left 為該元素到瀏覽器左側可視點的距離
                //maskDiv.offsetWidth 為蒙版寬度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth/2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight/2;
                
                //判斷邊界
                if (left < 0)
                {
                    left = 0;
                }else if (left > smallPic.clientWidth - maskDiv.offsetWidth)
                {
                    //clientWidth不包含邊框 (含padding)
                    //offsetWidth包含邊框 (含padding)，因mask是整題移動，所以也要計算到
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }

                if (top < 0)
                {
                    top = 0;
                }else if (top > smallPic.clientHeight - maskDiv.offsetHeight)
                {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }
                //設置蒙版屬性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //大圖框移動
                //計算移動距離的倍率，圖框因為不會動 一律用clientWidth
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth);

                //由倍率，算出大圖片要移動多少
                //注意，要加上負號，他的移動方式和蒙版的不同
                //蒙版是在小圖框上移動， 而大圖框是在大圖片上移動  相反的
                BigImg.style.left = -left / scale + "px";
                BigImg.style.top = -top / scale + "px";
            }
            //3. 移除時(onmouseleave)，移除蒙版、大圖框、大圖片元素
            smallPic.onmouseleave = function()
            {
                //讓小圖框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //讓leftTop移除大圖框
                leftTop.removeChild(BigPic);
            }
        }
    }

    /**
     * 1. 先獲取piclist元素下的ul
     * 2. 再獲取data.js文件下的goodData -> imagessrc
     * 3. 遍歷數組，根據數組長度創建li元素
     * 4. 讓ul遍歷追加li元素
     */
    //動態改變放大鏡縮略圖的數據
    thumbnailData();
    function thumbnailData()
    {
        //1. 先獲取piclist元素下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul ');
        
        //2. 再獲取data.js文件下的goodData -> imagessrc
        var imagessrc = goodData.imagessrc;

        //3. 遍歷數組，根據數組長度創建li元素
        for (var i = 0; i < imagessrc.length; i++)
        {
            var newLi = document.createElement('li');
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            //讓li追加img元素
            newLi.appendChild(newImg);

            //4. 讓ul遍歷追加li元素
            ul.appendChild(newLi);
        }

    }

    //點擊縮略圖 改變小圖框、大圖框的圖片
    /**
     * 1. 獲取所有li元素，並且循環發生點擊事件
     * 2. 點擊縮略圖，確定其下標位置，找到對應的小圖、大圖路徑，並且改變現有src的值
     */
    thumbnailClick();
    function thumbnailClick()
    {
        // 1. 獲取所有li元素，並且循環發生點擊事件
        //注意 選擇器是用All，得到一個list
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');
        var smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');
        var imagessrc = goodData.imagessrc;

        //小圖路徑需要默認 為資料庫中的第一筆，而不是用html寫死
        smallPic_img.src = imagessrc[0].s

        //循環點擊li標籤
        for (var i = 0; i < liNodes.length; i++)
        {
            
            // 因i是用var，執行結束後，所有i都通用同一個值(14)，所以要另外添加變量 記錄下標
            liNodes[i].index = i; //同setAttribute('index',i)
            liNodes[i].onclick = function()
            {
                var idx = this.index;
                bigimgIndex = idx;

                //變換小圖路徑
                smallPic_img.src = imagessrc[idx].s;
            }
        }
    }

    //點擊縮略圖 左右箭頭的效果
    /**
     * 1. 先獲取左右兩端的箭頭按鈕
     * 2. 在獲取可視的div及ul元素 和 所有的li元素
     * 3. 計算 (發生起點、步長、ul總共可以移動的距離值)
     * 4. 然後再發生點擊事件
     */
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick()
    {
        // 1. 先獲取左右兩端的箭頭按鈕
        var prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');
        
        // 2. 在獲取可視的div及ul元素 和 所有的li元素
        var piclist = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist');
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');
        
        // 3. 計算 (發生起點、步長、ul總共可以移動的距離值)
        //我們希望按一次按鈕，移動2張圖 (2張圖+2個margin-right 20px*2)
        var start = 0;
        var step = (liNodes[0].offsetWidth + 20) * 2;

        //ul總共可以移動的距離值(即被隱藏的部分，需要移動的部分) = ul的總寬度 - div框的寬度(縮略圖) = (圖片總數 - div中顯示的數量) * (li的寬度 + 20(margin-right))
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        // 4. 然後再發生點擊事件
        //注意 因為ul的移動都是向左，都使得left小於0，所以改left時，都會加上負號
        next.onclick = function()
        {
            start += step;
            if (start > endPosition)
            {
                start = endPosition;
            }
            ul.style.left = -start + "px";
        }
        prev.onclick = function()
        {
            start -= step;
            if (start < 0)
            {
                start = 0;
            }
            ul.style.left = -start + "px";
        }
    }

    //動態渲染商品詳情
    /**
     * 1. 查找rightTop
     * 2. 查找data.js -> goodData -> goodDetail
     * 3. 建立一個字符串變量， 將原來的布局結構貼近來，將所對應的數據放在對應的位置上(innerHTML)，重新渲染rightTop
     */
    rightTopData();
    function rightTopData()
    {
        // 1. 查找rightTop
        var rightTop = document.querySelector("#wrapper #content .contentMain #center #right .rightTop");
        
        // 2. 查找data.js -> goodData -> goodDetail
        var goodsDetail = goodData.goodDetail;

        // 3. 建立一個字符串變量， 將原來的布局結構貼近來，將所對應的數據放在對應的位置上(innerHTML)，重新渲染rightTop
        // 字符串除了雙引號、單引號，還有模板字符串 (template string)
        // 我們現在要使用模板字符串，因為rightTop內容太多，容易拼接錯誤，且支援換行，不用額外打\n之類的
        // 模板字符串替換法: ${變量}
        var s = `<h3>${goodsDetail.title}</h3>
                 <!--簡介: 用p好處是會自動換行 且有默認上下間距-->
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>價&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>NT$</span>
                            <P>${goodsDetail.price}</P>
                            <!--小標籤可用i-->
                            <i>降價通知</i>
                        </div>
                        <p>
                            <span>累積評價</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;銷</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;
        // 重新渲染rightTop元素
        rightTop.innerHTML = s;
    }

    //商品參數數據的動態渲染
    /**
     * 1. 找rightBottom的元素對象
     * 2. 查找data.js -> goodData.goodDetail.crumbData數據
     * 3. 由於數據是數組，需要遍歷，有一個元素 則需要一個動態的dl元素(dt, dd)
     */
    rightBottomData();
    function rightBottomData()
    {
        //1. 找rightBottom的元素對象
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap');
        
        //2. 查找data.js -> goodData.goodDetail.crumbData數據
        var crumbData = goodData.goodDetail.crumbData;

        //3. 由於數據是數組，需要遍歷，有一個元素 則需要一個動態的dl元素(dt, dd)
        for (var i = 0; i < crumbData.length; i++)
        {
            //創建dl元素
            var dlNode = document.createElement('dl');

            //創建dt元素
            var dtNode = document.createElement('dt');
            dtNode.innerHTML = crumbData[i].title;

            //dl追加dt
            dlNode.appendChild(dtNode);

            //遍歷dd元素
            for (var j = 0; j < crumbData[i].data.length; j++)
            {
                //創建dd元素
                var ddNode = document.createElement('dd');
                ddNode.innerHTML = crumbData[i].data[j].type;
                ddNode.setAttribute('price',crumbData[i].data[j].changePrice);

                //dt追加dd
                dlNode.appendChild(ddNode);
            }

            //chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }

    }

    //點擊商品參數之後的顏色排他效果
    /**
     * 1. 獲取所有的dl元素，取其中第一個dl元素下的所有dd先做測試
     * 2. 循環所有的dd元素，並添加事件
     * 3. 確定實際發生事件的目標源對象設置其文字顏色為紅色，然後給其他所有的元素顏色都重置為基礎顏色(#666)
     * 4. 測試完畢後，在dl最前面加上for，讓它應用於所有下標
     * ========================================================================
     * 
     * 點擊dd後產生mark標記元素
     * 1. 創建一個數組，容納點擊的dd元素容器，確定數組的起始長度
     * 2. 然後再將點擊的dd元素的值，按照對應下標，寫入的元素身上
     * 3. 清空原本的mark後，再添加mark
     */
    clickaddBind();
    function clickaddBind()
    {
        //1. 獲取所有的dl元素，取其中第一個dl元素下的所有dd先做測試
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl');   
        
        //1. 創建一個數組，容納點擊的dd元素容器，確定數組的起始長度
        var arr = new Array(dlNodes.length);
        //為數組增加默認值 (利用填充方法)
        arr.fill(0);
        var choose = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .choose');

        //4. 測試完畢後，在dl最前面加上for，讓它應用於所有下標
        for (var i = 0; i < dlNodes.length; i++)
        {
            //第四步要用閉包，因為閉包是堆空間，不會系統自動回收和複寫
            //每次回圈呼叫的function，都是一個新的空間
            (function(i){
                var ddNodes = dlNodes[i].querySelectorAll('dd');
                //2. 循環所有的dd元素，並添加事件
                for (var j = 0; j < ddNodes.length; j++)
                {   
                    ddNodes[j].onclick = function()
                    {
                        //3. 清空原本的mark後，再添加mark
                        choose.innerHTML = "";

                        //3. 確定實際發生事件的目標源對象設置其文字顏色為紅色，然後給其他所有的元素顏色都重置為基礎顏色(#666)
                        //注意 這裡要用this，而不是ddNodes[i]，因為var的特性 for迴圈跑完後 i會卡在最後一個
                        //使用this則為該點擊呼叫對象
                        //重置dd顏色
                        for (k = 0; k < ddNodes.length; k++)
                        {
                            //在第四步，加入外層迴圈後，這裡會有一個BUG
                            //因為ddNodes最後會跑到 最後一個ddNode，所以所有onclick事件，這裡都會變成重製最後一個ddNode
                            //解決方法: 閉包
                            ddNodes[k].style.color = "#666";
                        }
                        this.style.color = "red";
                        
                        //2. 然後再將點擊的dd元素的值，按照對應下標，寫入的元素身上
                        //點擊後，動態產生一個新的mark標記元素
                        //這裡從原本的arr[i] = this.innerHTML改為arr[i] = this
                        //原因是，現在要將arr裡面存放為dd元素，dd元素裡面有屬性price，可用於之後的價格計算顯示
                        arr[i] = this;
                        changePriceBind(arr);

                        //遍歷arr數組，將非0元素的值 寫入到mark元素中
                        arr.forEach
                        (
                            function(value, index)
                            {
                                if (value != 0)
                                {
                                    //創建div元素
                                    var markDiv = document.createElement('div');
                                    markDiv.className = 'mark';
                                    markDiv.innerText = value.innerHTML;

                                    //創建a元素
                                    var aNode = document.createElement('a');
                                    aNode.innerText = 'X';
                                    //為了以後的移除功能，需要在為他新增一個下標
                                    //使用setAttribute 可以為html標籤 新增元素
                                    //<a index="0">X</A>
                                    aNode.setAttribute('index', index);

                                    markDiv.appendChild(aNode);
                                    
                                    //讓choose元素追加div
                                    choose.appendChild(markDiv);
                                }
                            }
                        );

                        //現在要做移除按鈕效果
                        //獲取所有a標籤，並且循環設置點擊事件
                        var aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .choose .mark a');
                        
                        for (var n = 0; n < aNodes.length; n++)
                        {
                            aNodes[n].onclick = function()
                            {
                                //獲取點擊元素的index下標
                                var idx1 = this.getAttribute('index');
                                //恢復數組中，對應下標值
                                arr[idx1] = 0;

                                //找到對應下標的dd元素
                                var ddlist = dlNodes[idx1].querySelectorAll('dd');

                                //遍歷所有dd元素
                                for ( var m = 0; m < ddlist.length; m++)
                                {
                                    //默認第一個元素為紅色，其餘為灰色
                                    ddlist[m].style.color = '#666';
                                }
                                ddlist[0].style.color = "red";

                                //刪除對應下標的mark元素
                                //我們點的是a，所以他的parentNode為mark
                                choose.removeChild(this.parentNode);

                                changePriceBind(arr);
                            }
                        }
                    
                    }
                }
            })(i);
            
        }
    }

    //價格變動的函數
    /**
     * 點擊dd以及 刪除mark時，才需要調用
     * 1. 獲取價格標籤元素
     * 2. 給每個dd標籤，都記錄一個屬性，用來記錄變化的價格
     * 3. 遍歷arr數組，將dd元素身上的變化價格和已有的價格(5299)相加
     * 4. 渲染計算結果到p元素中
     */
    function changePriceBind(arr)
    {
        //1. 獲取價格標籤元素
        var oldPrice = document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p');
   
        //取出默認價格
        var price = goodData.goodDetail.price;

        //2. 給每個dd標籤，都記錄一個屬性，用來記錄變化的價格
        //3. 遍歷arr數組，將dd元素身上的變化價格和已有的價格(5299)相加
        for (var i = 0; i < arr.length; i++)
        {
            //arr非0才要取價格
            if (arr[i])
            {
                //屬性是字串，記得強制轉換為數字
                var changePrice = Number(arr[i].getAttribute('price'));

                //最終價格
                price = price + changePrice;
            }
        }

        oldPrice.innerHTML = price;

        //點擊套餐項目，價格需要變動
        //3. 將變化後的價格(changePriceBind)，寫入左側標籤中
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left .leftPriceWrap p');
        leftprice.innerText = 'NT$' + price;
        
        //根據複選框 重新渲染 套餐價
        var ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        for (var j = 0; j < ipts.length; j++)
        {
            if (ipts[j].checked)
            {
                price += Number(ipts[j].value);
            }
        }
        var newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        newprice.innerText = 'NT$' + price;
    }

    /**
     * 點擊套餐項目，價格需要變動
     * 
     * 1. 獲取中間區域所有的複選框元素
     * 2. 遍歷這些元素，並取出他們的價格，有左側基礎價格進行累加，變重新寫回套餐價格標籤
     * 3. 將變化後的價格(changePriceBind)，寫入左側標籤中
     */
    chooseprice();
    function chooseprice()
    {
        //1. 獲取中間區域所有的複選框元素
        var ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left .leftPriceWrap p');
        var newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        //2. 遍歷這些元素，並取出他們的價格，有左側基礎價格進行累加，變重新寫回套餐價格標籤
        for (var i = 0; i < ipts.length; i++)
        {
            ipts[i].onclick = function()
            {
                //因為拿到的leftprice是NT$5299，要透過slice，把NT$去掉
                var oldprice = Number(leftprice.innerText.slice(3));
                for (var j = 0; j < ipts.length; j++)
                {
                    if (ipts[j].checked)
                    {
                        //遍歷全部的複選框，如果有背勾選，就加進左側價格
                        //記得，複選框選出來的 是字串，要用Number轉換
                        oldprice = oldprice + Number(ipts[j].value);
                    }
                }

                //重新寫回套餐價標籤當中
                newprice.innerText = "NT$" + oldprice;
            }
        }
    }
}