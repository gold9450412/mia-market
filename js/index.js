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
}