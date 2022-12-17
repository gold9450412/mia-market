window.onload = function()
{
    /**
     * 1. 先獲得頁面元素 (navPath)
     * 2. 獲取數據 (data.js -> goodData.path)
     * 3. 遍歷數據，數據是動態的，相應的DOM也必須動態產生，需要創建DOM元素 (根據數據的數量)
     * 4. 創建標籤，而最後一個DOM元素，只創建a標籤，不創建i標籤
     */

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