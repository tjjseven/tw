// document.onkeydown = function () {
//     if (window.event && window.event.keyCode === 123) {
//         event.keyCode = 0;
//         event.returnValue = false;
//         return false;
//     }
// };

class TS {
    constructor(){
        this.popWidth = document.querySelector('.t-pop').offsetWidth
        this.popHeight = document.querySelector('.t-pop').offsetHeight
    }

    /**
     * 右键
     */
    keyRight(){
        var box=document.getElementById("keyRight");
        document.oncontextmenu=function(ev){
            console.log(ev)
            box.style.display="block";
            ev=ev||event;
            box.style.left=ev.pageX+"px";
            box.style.top=ev.pageY+"px";
            return false;
        }
        document.onclick=function(){
            box.style.display="none";
        }
    }
    /**
     * 倒计时组件
     * @param timer 结束显示区
     * @param hour 小时显示区
     * @param minute 分钟显示区
     * @param second 秒显示区
     * @param date 传入时间 "2017/12/12,1:41"
     */
    backTimers(obj) {
        // console.log(this.a)
        let clearTime,
            timerEle = document.querySelector(obj.timer),
            hourEle = document.querySelector(obj.hour),
            minuteEle = document.querySelector(obj.minute),
            secondEle = document.querySelector(obj.second);
        clearTime = setInterval(function () {
            backTime(obj);
        },1000);
        function backTime(obj){
            let nowDate = new Date(),
                setDate = new Date(obj.date),
                newDate = (setDate.getTime() - nowDate.getTime())/1000,
                h = parseInt(newDate/(60*60)%24),
                m = parseInt((newDate/60)%60),
                s = parseInt(newDate%60);
            function addZero(ele, times){
                if(times>= 0 && times< 10){
                    ele.innerHTML = "0" + times;
                }else{
                    ele.innerHTML = times;
                }
            }
            addZero(secondEle, s);
            addZero(minuteEle, m);
            addZero(hourEle, h);
            if(newDate<= 0){
                timerEle.innerHTML = obj.text || "活动已结束";
                timerEle.style.color = obj.color || "red";
                timerEle.style.fontSize = "16px";
                clearInterval(clearTime)
            }
        }
    };

    /**
     * 提示框组件
     * @param {Object} eleTag 元素
     * @param {Object} attr 需要变动的属性
     * @param {Object} target 目标值
     * @param {Object} speed 每次移动的距离
     * @param {Object} callBack 结束回调
     */
    move(obj) {
        //需要为每一个元素指定一个自己的timer来保存定时器
        var ele = document.querySelector('.t-pop'),that = this;
        ele.innerHTML = obj.text;
        obj.speed = 10
        obj.target = obj.target || 10
        ele.style.cssText += ';opacity:1;display:block;position:fixed;left:auto;right:auto;top:auto;bottom:auto'
        // 判断类型
        if(obj.type === 't-success'){
            insertIcon("✔ ")
            this.addClass(ele, 't-success')
        }else if(obj.type === 't-err'){
            insertIcon("× ")
            this.addClass(ele, 't-err')
        }else if(obj.type === 't-info'){
            insertIcon("▪ ")
            this.addClass(ele, 't-info')
        }else if(obj.type === 't-warning'){
            insertIcon("! ")
            this.addClass(ele, 't-warning')
        }else if(obj.type === 't-alert'){
            obj.speed = 30
            this.addClass(ele, 't-alert')
        }
        console.log(this.popWidth)
        // 判断方向
        if(obj.attr === 'top'){
            ele.style.left = 'calc(50% - 300px)'
            ele.style.top = -this.popHeight + 'px'
        }else if(obj.attr === 'bottom'){
            ele.style.left = 'calc(50% - 300px)'
            ele.style.bottom = -this.popHeight + 'px'
        }else if(obj.attr === 'left'){
            ele.style.top = 500 + 'px'
            ele.style.left = -this.popWidth + 'px'
        }else if(obj.attr === 'right'){
            ele.style.right = -this.popWidth + 'px'
        }

        clearInterval(ele.timer);
        ele.timer = setInterval(function() {
            var oldValue = parseInt(that.getStyle(ele, obj.attr));
            //判断元素的移动方向
            if (oldValue > obj.target) {
                var newValue = oldValue - obj.speed;
                //如果新的值小于目标值，则让新值等于目标值
                if (newValue < obj.target) {
                    newValue = obj.target;
                }
            } else {
                newValue = oldValue + obj.speed;
                //在赋值之前判断
                if (newValue > obj.target) {
                    newValue = obj.target;
                }
            }
            //修改box1的left属性值
            ele.style[obj.attr] = newValue + "px";
            if (newValue === obj.target) {
                //停止定时器
                clearInterval(ele.timer);
                if(obj.time){
                    clearTimeout(ele.timeout)
                    ele.timeout = setTimeout(function () {
                        ele.style.cssText += ';display:none;opacity:0;position:static;left:auto;right:auto;top:auto;bottom:auto';
                        that.removeClass(ele, obj.type)
                        //判断是否有回调函数
                        if (obj.callBack) {
                            obj.callBack();
                        }
                    },obj.time)
                }
            }
        }, 10);

        // 插入icon
        function insertIcon(icon) {
            var reg = new RegExp(icon,"g");
            if(!reg.test(ele.childNodes[0].nodeValue)){
                ele.childNodes.item(0).insertData(0,icon)
            }
        }

    };

    /**
     * 联动菜单组件
     */
    linkage(){
        var that = this,linkageArr = document.querySelectorAll('.t-linkage>p')
        // 获取所有兄弟节点
        function getsiblings(myself) {
            var siblingsArr = []
            for (var j = 0; j < myself.parentNode.children.length; j++) {
                if(myself.parentNode.children[j] !== myself){
                    siblingsArr.push(myself.parentNode.children[j])
                }
            }
            return siblingsArr
        }
        // 给子节点添加class
        function addSelfClass(siblings, index, cls, self) {
            for (var k = 0; k < siblings.length; k++) {
                // 判断兄弟的子节点是否有class
                if(that.hasClass(siblings[k].children[index], cls)){
                    that.removeClass(siblings[k].children[index], cls)
                }
            }
            that.addClass(self, cls)
        }
        for (var i = 0; i < linkageArr.length; i++) {
            linkageArr[i].onclick = function () {
                var myself = this.parentNode;
                if(this.nextElementSibling){
                    console.log(that.hasClass(this.nextElementSibling, 't-linkage-show'))
                    if(!that.hasClass(this.nextElementSibling, 't-linkage-show')){
                        var siblings = getsiblings(myself)
                        addSelfClass(siblings, 0, 't-linkage-select', this)
                        addSelfClass(siblings, 1, 't-linkage-show', this.nextElementSibling)
                    }
                }else{
                    addSelfClass(getsiblings(myself), 0, 't-linkage-select', this)
                }
            }
        }
    }

    /**
     * 选项卡
     */
    tabs(){
        var li = document.querySelectorAll('.t-tabs>ul>li'), div = document.querySelectorAll('.t-tabs>div');
        for(var i=0;i<li.length;i++){
            (function(i){
                li[i].onmouseover = function(){
                    for(var j = 0; j < li.length; j++){
                        li[j].className = "";
                        div[j].className = "t-hide";
                    }
                    this.className = "t-tabs-hover";
                    div[i].className = "";
                }
            })(i)
        }
    }

    /**
     * 卡号复制
     */
    copyNum(){
        const copyObj = document.querySelector(".t-copy>p")
        const copySpan = document.querySelector(".t-copy>span")
        const objText = copyObj.innerText;
        // objText.substring(3,7).replace(/^4/g,'*')
        var objRep = objText.slice(0, 3) + "****" + objText.substr(-3)
        copySpan.innerText = objText
        copyObj.innerText = objRep

        copyObj.onmouseover = () => {
            copySpan.style.display = 'block'
        }
        copyObj.onmouseout = function() {
            copySpan.style.display = 'none'
        }
        copyObj.onclick = function() {
            var oInput = document.createElement('input');
            oInput.value = copySpan.innerText;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display='none';
            alert('复制成功');
        }
    }

    /**
     * 轮播组件，同时支持多个
     * @param ele 触屏元素
     * @param index 轮播元素对应的索引,默认为0，避免干扰
     */
    autoPlay(obj){
        var ele = document.querySelector(obj.ele),
            ele_ul = document.querySelector(obj.ele + '>ul'),
            ele_li = document.querySelectorAll(obj.ele + '>ul li'),
            ele_img = document.querySelectorAll(obj.ele + '>ul img');
        clearInterval(ele_ul.auto);
        for (var i = 0; i < ele_li.length; i++) {
            ele_li[i].style.width = ele.offsetWidth + 'px'
        }
        ele_ul.style.width = ele.offsetWidth * ele_li.length + 'px'
        /*定义定时器参数*/
        // var auto;
        // var timer;
        /*定义自适应参数*/
        var screenWidth;//获取可视屏幕的宽度
        var maxWidth = ele.offsetWidth;
        var minWidth = 320;
        var imgscreenWidth = 0;//轮播图的适应宽度
        //1 轮播图自适应
        screenWidth=window.innerWidth;
        for(var i=0;i<ele_img.length;i++){
            if(screenWidth>maxWidth){
                ele_img[i].style.width=maxWidth+"px";
                imgscreenWidth=maxWidth;
            }else if(screenWidth<=maxWidth && screenWidth>=minWidth){
                ele_img[i].style.width=screenWidth+"px";
                imgscreenWidth=screenWidth;
            }else if(screenWidth<minWidth){
                ele_img[i].style.width=minWidth+"px";
                imgscreenWidth=minWidth;
            }
        }

        //2 动态添加轮播导航
        var nav = ele.querySelector(".t-banner-nav");
        for(var j=0;j<ele_img.length-1;j++){
            if(nav.children.length < ele_img.length-1){
                nav.innerHTML+="<a href='javascript:;'></a>";
            }
        }
        nav.style.left=(ele.offsetWidth-nav.offsetWidth)/2+"px";

        //3 图片触屏轮播
        var startPageX;
        var movePageX;
        //触屏开始
        ele.addEventListener("touchstart",function(event){
            clearInterval(ele_ul.auto);
            var touch=event.targetTouches;//获取触摸信息

            if(touch.length===1){//一个手指触摸
                startPageX=touch[0].pageX;
                movePageX=0;
            }
        },false);

        //触屏移动
        ele.addEventListener("touchmove",function(event){
            var touch=event.targetTouches;
            if(touch.length===1){
                movePageX=touch[0].pageX;
            }
        },false);

        //触屏结束
        ele.addEventListener("touchend",function(){
            console.log(event);
            if(movePageX===0){
                return;
            }
            if(movePageX>startPageX){
                console.log("右划");
                obj.index--;//步骤1
                if(obj.index===-1){//步骤2
                    obj.index=ele_img.length-2;
                    ele_ul.style.transition="none";
                    ele_ul.style.marginLeft=-(ele_img.length-1)*imgscreenWidth+"px";
                }
                ele_ul.timer = setTimeout(function () {//步骤3
                    ele_ul.style.marginLeft = -imgscreenWidth * obj.index + "px";
                    ele_ul.style.transition = "1s linear";
                }, 100);
                navMove();
            }else{
                console.log("左划");
                runAuto();
            }
            ele_ul.auto=setInterval(runAuto,2000);
        },false);

        //4 自动轮播
        function runAuto(){
            if(obj.index===ele_img.length-2){//步骤3
                ele_ul.timer = setTimeout(
                    function(){
                        obj.index=0;
                        ele_ul.style.transition="none";
                        ele_ul.style.marginLeft=0+"px";
                    },1000
                )
            }
            obj.index++;//步骤1
            ele_ul.style.marginLeft=-imgscreenWidth*obj.index+"px";//步骤2
            ele_ul.style.transition="1s linear";
            navMove();
        }
        ele_ul.auto=setInterval(function () {
            runAuto();
        },2000);

        //5 导航点移动
        var nav_a=document.querySelectorAll('.t-banner-nav a');
        nav_a[0].style.backgroundColor="white";
        function navMove(){
            for (var i = 0; i <nav_a.length; i++) {
                nav_a[i].style.backgroundColor="";
            }
            if(obj.index<=5){
                nav_a[obj.index].style.backgroundColor="white";
            }
            if(obj.index===6){
                nav_a[0].style.backgroundColor="white";
            }
        }
    };

    /**
     * @param height高度
     * @param speed速度
     * @param delay时间
     * @param index
     */
    startmarquee(obj){
        var t, p = false, o = document.querySelector(obj.ele), li = document.querySelectorAll(obj.ele + ' li')[0];
        // console.log(o)
        o.style.cssText += ';width:' + obj.width + 'px;height:' + obj.height + 'px;line-height:' + obj.height + 'px';
        li.style.cssText += ';height:' + obj.height + 'px;line-height:' + obj.height + 'px';
        o.innerHTML += o.innerHTML;
        o.onmouseover = function(){p = true}
        o.onmouseout = function(){p = false}
        o.scrollTop = 0;
        function start(){
            t = setInterval(scrolling, obj.speed);
            if(!p){ o.scrollTop += 1;}
        }
        function scrolling(){
            if(o.scrollTop % obj.height !== 0){
                o.scrollTop += 1;
                if(o.scrollTop >= o.scrollHeight/2){
                    o.scrollTop = 0;
                }
            }else{
                clearInterval(t);
                setTimeout(start, obj.delay);
            }
        }
        setTimeout(start, obj.delay);
    }





    /**
     *  公共方法
     */
    // 获取外部样式
    getStyle(eleArg, attrArg) {
        try {
            return getComputedStyle(eleArg, null)[attrArg];
        } catch (e) {
            return eleArg.currentStyle[attrArg];
        }
    }
    hasClass(eleArg, cn) {
        var className = eleArg.className,cnReg = new RegExp("\\b" + cn + "\\b");
        return cnReg.test(className);
    }
    addClass(eleArg, cn) {
        if (!this.hasClass(eleArg, cn)) {
            eleArg.className += " " + cn;
        }
    }
    removeClass(eleArg, cn) {
        var cnReg = new RegExp("\\b" + cn + "\\b");
        eleArg.className = eleArg.className.replace(cnReg, "");
    }
}