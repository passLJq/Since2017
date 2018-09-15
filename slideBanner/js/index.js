window.onload=function () {


var isAuto = true;   //是否自动轮播
var TimerForAuto=2;     //自动轮播滑动间隔时间(秒)

    //根据页面大小自动适应宽高
    $(window).resize(function () {
        $(".slide").height($(".slide").width()*0.56)
    })

    $(".slide").height($(".slide").width()*0.56)
    
    for(var i=0;i<$(".slide li").length;i++){
        $(".slide li").eq(i).attr("imgId",i)
    }
    var timer = null
    
    if(isAuto){
        autoTimer()
    }
    $(".slide li").on("mouseenter",function () {
        clearInterval(timer)
    })
    $(".slide li").on("mouseleave",function () {
        autoTimer()
    })
    $(".small").on("mouseenter",function () {
        clearInterval(timer)
    })
    $(".small").on("mouseleave",function () {
        autoTimer()
    })
    //点击左右滑动

    clickAuto()

    function clickAuto() {
        var img2=null
        var img4=null

        img2=$(".slide li.img2")	  //每次执行重新定义变量
        img4=$(".slide li.img4")

        $(".slide li").off("click")   //每次执行先解绑事件

        img2.on("click",function (){  //每次执行重新绑定事件
            left()
        })
        img4.on("click",function (){
            right()
        })

    }
    //左滑动封装
    function left() {
        for(var i=0;i<$(".slide li").length;i++){
            var num=$(".slide li").eq(i).attr("imgId")
            $(".slide li").eq(i).removeAttr("class")
            $(".slide li").eq(i).removeAttr("imgId")
            num++
            if(num===5){
                num=1
            }else {
                num++
            }

            $(".slide li").eq(i).addClass("img"+num)
            $(".slide li").eq(i).attr("imgId",num-1)

        }
        clickAuto()		//每次执行都重新定义左右的点击变量
        light()
    }
    //右滑动封装
    function right() {
        for(var i=0;i<$(".slide li").length;i++){
            var num=$(".slide li").eq(i).attr("imgId")
            $(".slide li").eq(i).removeAttr("class")
            $(".slide li").eq(i).removeAttr("imgId")
            num++
            if(num===1){
                num=5
            }else {
                num--
            }

            $(".slide li").eq(i).addClass("img"+num)
            $(".slide li").eq(i).attr("imgId",num-1)
        }
        clickAuto()
        light()
    }
    //自动滑动
    function autoTimer() {
        timer=setInterval(function () {
            right()
        },TimerForAuto*1000)
    }

    //小方块
    $(".small").css("margin-left","-"+($(".small").width())/2+"px")
    light()
    function light(){
        for(var k=0;k<$(".slide li").length;k++){
            if($(".slide li").eq(k).hasClass("img3")){
                var light = k
            }
        }
        $(".small div").removeClass("light")
        $(".small div").eq(light).addClass("light")
    }
    //点击小方块播放到对应图片
    $(".small div").click(function(){
        move($(this).index())
    })
    function move(id){
        var imgId = parseInt($(".slide li.img3").index())
        var td = parseInt(id-imgId)
        if(td<0){
            for(var i=0;i<Math.abs(td);i++){
                setTimeout(function(){
                    left()
                },1)
            }

        }else if(td>0){
            for(var i=0;i<Math.abs(td);i++){
                setTimeout(function(){
                    right()
                },1)
            }
        }
    }
}