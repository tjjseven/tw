/**
 * 日期插件
 */
var startNowDatePoor, startEndDatePoorSecond, startDateStr, endDateStr, nowDateStr, startTimeObj, endTimeObj, isSelect = false
layui.use(['laydate', 'form'], function(){
    var laydate = layui.laydate, $ = layui.$;
    // $('.date_plugin').hide()
    $('.mytime_input').val('2018-07-10 03:03:03 - 2018-07-10 05:04:07')
    $('.mytime_input').focus(function () {
        $(this).val('')
    })
    var mydate = laydate.render({
        elem: '.date_plugin',
        type: 'datetime',
        show: false,
        max: new Date().getTime(),
        value: '', //
        btns: ['today','sevenday','thirtyday','halfyear','oneyear','clear','confirm','onedayconfirm'],
        ready: function(date){
            // isSelect = true
            // $('.laydate-btns-confirm').addClass('laydate-disabled')
            console.log('点击日期')
            // console.log(date)
            var todayBtn = $(".laydate-btns-today"), sevendayBtn = $(".laydate-btns-sevenday"), thirtydayBtn = $(".laydate-btns-thirtyday"),
            halfyearBtn = $(".laydate-btns-halfyear"), oneyearBtn = $(".laydate-btns-oneyear"), onedayconfirm = $(".laydate-btns-onedayconfirm");
            todayBtn.text('今天'); sevendayBtn.text('最近7天'); thirtydayBtn.text('最近30天'); halfyearBtn.text('最近半年');
            oneyearBtn.text('最近1年');onedayconfirm.text('confirm').hide()
            // 今天
            todayBtn.click(function(){ showTimeScope(0) })
            // 最近7天
            sevendayBtn.click(function(){ showTimeScope(7) })
            // 最近30天
            thirtydayBtn.click(function(){ showTimeScope(30) })
            // 最近半年
            halfyearBtn.click(function(){ showTimeScope(180) })
            // 最近1年
            oneyearBtn.click(function(){ showTimeScope(365) })

            // $('.laydate-btns-confirm').addClass('laydate-disabled')
            $('.layui-laydate').delegate('td:not(td.laydate-disabled)', 'click',function () {
                isSelect = true
                var flag = $('.laydate-btns-confirm').hasClass('laydate-disabled')
                console.log(flag)
                // 点击一次
                if(flag){
                    onedayconfirm.show()
                    $('.laydate-btns-confirm').hide()
                    mydate.hint('若选择当前日期00:00 至 24:00，请点击确认按钮，否则再点一次')
                    // 判断是否为当天
                    // var selDay = parseInt($(this).text()), selHeader = $(this).parents('.layui-laydate-content').prev(),
                    //     selMonth = parseInt($(selHeader).find('span[lay-type = month]').text()) - 1,
                    //     selYear = parseInt($(selHeader).find('span[lay-type = year]').text()), nowTimerObj = mydate.config.max;
                    // // console.log(selMonth,selYear)
                    // // console.log(mydate.config.max)
                    // if(selDay === nowTimerObj.date && selMonth === nowTimerObj.month && nowTimerObj.year){
                    //     console.log(mydate.config.max)
                    // }
                }else{
                    onedayconfirm.hide()
                    $('.laydate-btns-confirm').show()
                }
            })

            // 当天事件
            onedayconfirm.click(function () {
                isSelect = false
                var selDay = $(this).parents('.layui-laydate').find('td.layui-this').attr('lay-ymd'),nowTimerObj = mydate.config.max,
                nowTimer = nowTimerObj.year + '-' + parseInt(nowTimerObj.month+1) + '-' + nowTimerObj.date
                // 判断是否为当天
                // console.log(timeBefore(0).allFormat)
                if(selDay === nowTimer){
                    showTimeScope(0)
                }else{
                    var showTimerArr = selDay.split('-')
                    var showMonth = showTimerArr[1] < 10 ? 0+showTimerArr[1] : showTimerArr[1],
                        showDay = showTimerArr[2] < 10 ? 0+showTimerArr[2] : showTimerArr[2],
                        showTimer = showTimerArr[0] + '-' + showMonth + '-' + showDay,
                        startOnlyTime = showTimer + ' 00:00:00' + ' - ' + showTimer + " 24:00:00",
                        // 判断是否为一年以上
                        datePoor = getDateDiff(showTimer, timeBefore(0).allFormat, "day")
                        if(datePoor>365){
                            layer.alert("抱歉!您只能查看近期一年内的数据", function () {
                                window.location.reload()
                            })
                        }else{
                            $('.mytime_input').val(startOnlyTime)
                        }
                        // console.log(datePoor)
                    $('.layui-laydate').hide()
                }
                // console.log(selDay) //lay-ymd="2018-7-28"
            })
            // console.log(isSelect)

        },
        change: function(value, date, endDate){
            isSelect = true
            console.log('日期选定')
            startDateStr = date.year + '-' + date.month + '-' + date.date + ' ' + date.hours + ':' + date.minutes + ':' + date.seconds;
            endDateStr = endDate.year + '-' + endDate.month + '-' + endDate.date + ' ' + endDate.hours + ':' + endDate.minutes + ':' + endDate.seconds;
            nowDateStr = timeBefore(0).allFormat
            startTimeObj = { allFormat : value.split(' - ')[0] }
            endTimeObj = { allFormat : value.split(' - ')[1] }
            // 时间差
            startNowDatePoor = getDateDiff(startDateStr, nowDateStr, "day")
            startEndDatePoorSecond = getDateDiff(startDateStr, endDateStr, "second");
            // 判断起始日期是否为同一天
            if(!startEndDatePoorSecond){
                mydate.hint('若起始日期为同一天，请在左下角选择不同的起始时间')
            }else{
                mydate.hint('您选择的时间范围为：' + '<br/>' + value + '<br/>' + '请点击确定按钮');
            }
            // console.log(tool)
        },
        done: function(value, date, endDate){
            if(!value || !isSelect){
                return
            }
            isSelect = false
            console.log('确定')
            //console.log(value); //得到日期生成的值，如：2017-08-18
            //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            console.log(startEndDatePoorSecond)
            // mydate.hint(value)
            if(!startEndDatePoorSecond){
                layer.alert('若起始日期为同一天，请选择不同的起始时间', function () {
                    window.location.reload()
                })
            }
            // 显示类型
            seleTimeLinkage(startDateStr, endDateStr)
        },
        range: true //或 range: '~' 来自定义分割字符
    });

    /**
     * 快捷键显示时间范围
     * @param num
     * @returns
     */
    function showTimeScope(num){
        var recentDate = timeBefore (num), nowDate = timeBefore (0);
        startNowDatePoor = num;
        if(num===0){
            recentDate = nowDate.yearFormat + '-' + nowDate.monthFormat + '-' + nowDate.dayFormat + ' ' + '00:00:00'
            var todayTimeObj = {}
            todayTimeObj.allFormat = recentDate
            todayTimeObj.yearFormat = nowDate.yearFormat
            todayTimeObj.monthFormat = nowDate.monthFormat
            todayTimeObj.dayFormat = nowDate.dayFormat
            todayTimeObj.hoursFormat = 0
            todayTimeObj.minuteFormat = 0
            $('.mytime_input').val(recentDate + ' - ' + nowDate.allFormat)
            startTimeObj = todayTimeObj
            seleTimeLinkage(recentDate, nowDate.allFormat)
        }else{
            $('.mytime_input').val(recentDate.allFormat + ' - ' + nowDate.allFormat)
            startTimeObj = recentDate
            seleTimeLinkage(recentDate.allFormat, nowDate.allFormat)
        }
        $('#layui-laydate1').hide()
        endTimeObj = nowDate
    }

    /**
     * 根据时间范围选择显示类型
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @returns
     */
    function seleTimeLinkage(startTime, endTime){
        $('#timeType+div dd[lay-value=""]').click()
        // 开始到结束的时间差
        var startEndDatePoor = getDateDiff(startTime, endTime, "hour");

        // 开始时间距当天的时间差
        // console.log('时间跨度(小时)'+startEndDatePoor)
        // console.log('开始到今天的时间差(天)'+startNowDatePoor);
        // 隐藏所有类型
        $('#timeType+div dd[lay-value!=""]').hide()
        if(startNowDatePoor>=0 && startNowDatePoor<=7){
            // console.log('7天之内')
            if(startEndDatePoor>=0 && startEndDatePoor<=1){
                // console.log('0到1')
                $('#timeType+div dd[lay-value=2]').show()
            }else if(startEndDatePoor>1 && startEndDatePoor<=24){
                // console.log('1到24')
                $('#timeType+div dd[lay-value=1],#timeType+div dd[lay-value=2]').show()
            }else{
                // console.log('24到168')
                $('#timeType+div dd').show()
            }
        }else if(startNowDatePoor>7 && startNowDatePoor<=30){
            startEndDatePoor>=0 && startEndDatePoor<=24 ? $('#timeType+div dd[lay-value=1]').show() : $('#timeType+div dd[lay-value=0],#timeType+div dd[lay-value=1]').show()
            // console.log('7到30天之内')
        }else if(startNowDatePoor>30 && startNowDatePoor<=365){
            // console.log('30到365天之内')
            $('#timeType+div dd[lay-value=0]').show()
        }else{
            // console.log('365天之后')
            layer.alert("抱歉!您只能查看近期一年内的数据", function () {
                window.location.reload()
            })
            $('#timeType+div dd').show()
        }
    }

})





function editChart() {
    var timers = arguments[3]
    /**
     * 图表全局配置
     */
    Highcharts.setOptions({
        lang: {
            noData: '暂无数据，小迪请选择',
            loading: '加载中...',
            numericSymbolMagnitude: 1024, // 自定义基数
            numericSymbols:["KB" , "MB" , "GB" , "TB" , "PB", 'EB', "ZB"], // 自定义单位
            thousandsSep: ',' // 千分号
        }
    });

    /**
     * highchars配置
     **/
// 图表标题
    var chartTitle = ['产品使用量统计'];
// 图表类型
    var chart = {
        type: 'line',
        backgroundColor: '#fff',
        zoomType: 'x'
    };
// 图表标题
    var title = {
        align: 'left',
        text: '',
        margin: 50,
        style: { "color": "#fff", "fontSize": "16px" }
    };
// 没有数据时显示
    var noData = {
        style: {
            fontSize: '16px'
        }
    }
// 加载中选项配置
    var loading = {
        hideDuration: 500, // 淡出
        showDuration: 500, // 淡入
        labelStyle: {
            fontSize: '16px'
        }
    };
// x轴配置
    var xAxis = {
        // categories: [], // 指定横轴坐标点的值
        labels: {
            // format: '{value} x',
            x: 0, // 调节x偏移
            rotation: 0,  // 旋转,效果就是影响标签的显示方向
        },
        opposite: false,// 时间显示X轴上与下
        type: 'datetime',
        // minRange: 3600,
        dateTimeLabelFormats: {
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m月%d',
            week: '%m月 %d',
            month: '%m月 %y',
            year: '%Y'
        },
        title: {
            align: 'high',
            text: '', // x标题
            style: {
                color: '#666',
                fontSize: '14px'
            }
        },
    };
// y轴配置
    var yAxis = {
        min: 0,
        // tickPositions: [], // 指定竖轴坐标点的值
        labels: {
            //	format: '{value} ',
        },
        title: {
            align: 'high',
            text: '流量', // y标题
            style: {
                color: '#666',
                fontSize: '14px'
            }
        },
        stackLabels: {
            enabled: true, // 数字显示
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        },
        tickAmount: 8, // y轴刻度数
        tickInterval: 1048576, // 刻度间隔
        // tickPixelInterval: 100 // 间隔px
    };
// 版权信息
    var credits = {
        enabled: false // highcharts网址
    };
// 数据提示框
    var t = '1';
    var tooltip = {
        headerFormat: '时间:',
        // formatter: function () {
        //     console.log(this)
        // },
        // pointFormat: '{series.color}{series.name}: {point.x} bps1 <br/>', // 提示框数据内容自定义
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
        pointFormatter: function () {
            console.log(this.series.name)
            if(timers){
                var tipsHtml = '<br/><span style="color:' + this.color + ';">\u25CF</span>' + this.series.name + ': <b>' + this.y + ' B</b><br/><br/>'
                return timers[this.index] + tipsHtml
                // return tipsHtml
            }else{
                return 1
            }
        },
        shared: false, // 合并显示多条数据
        valueSuffix: ' B',//数据后
        valuePrefix: '共计',// 数据前
        //   crosshairs: true,
        //   crosshairs: [{            // 设置准星线样式
        //  width: 30,
        // color: '#fff'
        //			}],
        // 当x轴为时间轴时 提示框内的时间格式化
        dateTimeLabelFormats: {
            second: '%H:%M:%S. %Y年%m月%d日',
            minute: '%H:%M. %m月. %d日. %Y年',
            hour: '%H:%M. %m月. %d日. %Y年',
            day: '%m月. %d日. %Y年',
            week: '%d日. %m月',
            month: '%m月 .%y年',
            year: '%Y年'
        },
    };
    // tooltip.headerFormat = t
    // console.log(point.x)
// 主体配置
    var plotOptions = {
        series: {
            pointPadding:0.2,
            events: {
                // 图例legend点击事件
                legendItemClick: function (event) {
                    // console.log(event)
                    // editChart()
                    return true; //return  true 则表示允许切换
                }
            },
            marker: {
                // enabled: false // 数据点标记
                symbol: 'circle' // 数据点形状
            }
        },
        column: {
            // percent置顶
            stacking: 'normal',
            pointPadding: 0.2,
            pointWidth: 5 , //柱子的宽度
            // 如果x轴一个点有两个柱，则这个属性设置的是这两个柱的间距。
            groupPadding : 0.5,
        }
    };
// 底部分类信息
    var legend = {
        align: 'center',
        verticalAlign: 'bottom',
        y: 25,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#fff',
        shadow: false,
        maxHeight: 50,
        padding: 15
    };


// 其他
    var series = arguments[1], arr = [],
    // 显示类型
    timeType = [
        24 * 3600 * 1000, // one day
        3600 * 1000, // one hours
        60 * 1000 // one minute
    ];
    if(series){
        // 根据数据动态变换Y轴
        for (let i = 0; i < series.length; i++) {
            for (let j = 0; j < series[i].data.length; j++) {
                arr.push(series[i].data[j])
            }
        }
        var maxNum = Math.max.apply(this, arr);
        // if (maxNum <= 1048576) { //1M
        //     yAxis.tickInterval = 102400 //10K
        // } else if (maxNum > 1048576 && maxNum <= 10485760) { //10M
        //     yAxis.tickInterval = 1048576 //1M
        // } else if (maxNum > 10485760 && maxNum <= 104857600) { //100M
        //     yAxis.tickInterval = 10485760 //10M
        // } else if (maxNum > 104857600 && maxNum <= 1048576000) { //1000M
        //     yAxis.tickInterval = 104857600 //100M
        // } else if (maxNum > 1048576000 && maxNum <= 10737418240) { //10G
        //     yAxis.tickInterval = 1048576000 // 1000M
        // } else if (maxNum > 10737418240) { // 100G
        //     yAxis.tickInterval = 10737418240 // 10G
        // }

        // time显示类型
        if(series[0].pointInterval){
            switch (series[0].pointInterval){
                case 0:
                    for (let i = 0; i < series.length; i++) {
                        series[i].pointInterval = timeType[0];
                    }
                    break;
                case 1:
                    for (let i = 0; i < series.length; i++) {
                        series[i].pointInterval = timeType[1];
                    }
                    break;
                case 2:
                    for (let i = 0; i < series.length; i++) {
                        series[i].pointInterval = timeType[2];
                    }
                    break;
                default:
                    for (let i = 0; i < series.length; i++) {
                        series[i].pointInterval = timeType[0];
                    }
            }
        }



        // 图表时间
        if(!series[1].pointStart && arguments[2]){
            xAxis.categories = arguments[2]
        }
    }

    // 初始化图表
    var flowObj = {
        chart: chart,
        title: title,
        noData: noData,
        loading: loading,
        xAxis: xAxis,
        yAxis: yAxis,
        legend: legend,
        tooltip: tooltip,
        plotOptions: plotOptions,
        credits: credits,
        series: series
    };
    Highcharts.chart(arguments[0], flowObj)
    return Highcharts.chart(arguments[0], flowObj)
}