// {"班级":"UAIF1901","教室":"303","周数":"56","课程":"{"Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉","Python基础":"杨登辉"}"}


// 渲染日期数据
function renderDate(date){
    let tds = $("#date").children("td")
    date.forEach((item,index)=>{
        tds.eq(index+1).html(item)
    })
}
// 渲染班级
function renderClass(arr){
    // 清空班级数据
    let trs = $("#table tr")
    for(let i=2;i<trs.length;i++){
        trs.eq(i).remove()
    }

    arr.forEach((item,index)=>{
        let classname = item.class
        let room = item.room
        let con = item.con
        let teacher = item.teacher
        let table = $("#table")
        // 渲染第一行  班级名 课程名  con
        let tr = $('<tr>')
        for(let i=0;i<9;i++){

            let td = $("<td>")
            td.attr('align',"center")
            if(i==0){
                td.html(classname)
                td.attr('rowspan',"3" )
                td.css({
                    'text-align':'center',
                    'vertical-align':'middle'
                })
            }else if(i==1){
                td.html("课程内容")
            }else{
                td.html(con[i-2])
                td.addClass("con")
                td.attr('clsname',classname)
                td.attr('day',i-2)
            }
            td.appendTo(tr)
        }
        tr.appendTo(table)

        // 渲染第二行  布道师
        let tr1 = $("<tr>")
        for(let i=0;i<8;i++){
            let td = $('<td>')
            td.attr('align',"center")
            if(i==0){
                td.html("布道师")
            }else{
                td.html(teacher[i-1])
                td.addClass("tea")
                td.attr('con',con[i-1])
                td.attr('day',i-1)
                td.attr("clsname",classname)
            }
            td.appendTo(tr1)
        }
        tr1.appendTo(table)
        // 渲染第三行  班级
        let tr2 = $("<tr>")
        for(let i=0;i<8;i++){
            let td = $('<td>')
            td.attr('align',"center")
            if(i==0){
                td.html("教室")
            }else{
                td.html(room)
                td.addClass("room")
                td.attr('clsname',classname)
            }
            td.appendTo(tr2)
        }
        tr2.appendTo(table)
    })
}


//渲染课表
function render(data){
    // 渲染日期
    renderDate(data.date)

    // 渲染班级
    renderClass(data.data)
}



$.ajax({
    url:'/getcourse/',
    type:"get",
    dataType:"json",
    success:function(data1){
        let data=data1
        render(data)


// let data = {
//     'date':['8月1日','8月2日','8月3日','8月4日','8月5日','8月6日','8月7日'],  // 日期
//     'num':23,   //周数
//     'data':[   // 课表数据
//         {
//             'class':"UAIF1901",
//             'room':'303教室',
//             'con':['python基础','python基础','python基础','python基础','python基础','python基础','python基础'],
//             'teacher':['杨登辉','杨登辉','杨登辉','杨登辉','杨登辉','杨登辉','杨登辉']
//         },
//     ]
// }




// 添加下拉框

function addSelect(target,type,arr1){
    let con = target.html()
    target.html("")
    arr = arr1
    // 添加下拉框
    let select = $("<select>")
    select.addClass('form-control')
    arr.forEach((item,index)=>{
        let option = $("<option>")
        option.html(arr[index])
        option.appendTo(select)
    })
    select.on("input",function(){
        if(type==0){
            let clsname = target.attr("clsname")
            data.data.forEach((item,index)=>{
                if(item['class']==clsname){
                    item['room']  = select.val()
                }
            })
        }else if(type==1){
            let clsname = target.attr("clsname")
            let con = target.attr("con")
            let day = target.attr("day")
            console.log(data)
            data.data.forEach((item,index)=>{
                if(item['class']==clsname){
                    item['teacher'][day]  = select.val()
                }
            })
        }else if(type==2){
            let clsname = target.attr("clsname")
            let con = target.attr("con")
            let day = target.attr("day")
            data.data.forEach((item,index)=>{
                if(item['class']==clsname){
                    item['con'][day]  = select.val()
                }
            })

        }
        render(data)
    })

    select.on("blur",function(){
        target.html(select.val())
    })
    select.appendTo(target)
}

// 修改课表内容
$('#table').dblclick(function(event){
    let target = $(event.target)
    let classname = target.attr("class")
    if(classname=='room'){
        let classesname=target.parent().prev().prev().children().first().html()
        $.ajax({
            url:'/getroom/'+classesname,
            type:"get",
            dataType:"json",
            success:function(data){
                arr = data['room_list']
                // console.log('arr',arr)
                addSelect(target,0,arr)
            }
        });
    }
    if(classname=='tea'){
        let classname=target.parent().prev().children().first().html()
        $.ajax({
            url:'/getteacher/'+classname,
            type:"get",
            dataType:"json",
            success:function(data){
                arr = data['teacherlist']
                arr.push('')
                // console.log('arr',arr)
                addSelect(target,1,arr)
            }
        });
    }
    if(classname=="con"){
        let classesname=target.parent().children().first().html()
        $.ajax({
            url:'/getstage/'+classesname,
            type:"get",
            dataType:"json",
            success:function(data){
                arr = data['stage_list']
                arr.push('')
                addSelect(target,2,arr)
            }
        });
    }
})

        let save=$('#save')
        save.on('click',function () {
            console.log(1)
            data2=JSON.stringify(data)

            $.ajax({
                url:'/savedata/',
                type:"POST",
                data:{data:data2},
                dataType:'json',
                success:function (res) {
                    console.log(data)
                    console.log(123)
                    alert(res)
                }
            })
        })

        let nextweek=$('#nextweek')
        nextweek.on('click',function () {
            $.ajax({
                url:'/getcourse/',
                type:"get",
                success:function (res) {
                    render(res)
                }
            })
        })

        let next2week=$('#next2week')
        next2week.on('click',function () {
            var d1 = new Date();
            var d2 = new Date();
            d2.setMonth(0);
            d2.setDate(1);
            var rq = d1-d2;
            var s1 = Math.ceil(rq/(24*60*60*1000));
            var s2 = Math.ceil(s1/7+1);

            $.ajax({
                url:'/getnext2course/'+s2,
                type:"get",
                success:function (res) {
                    render(res)
                }
            })
        })


    }
});
