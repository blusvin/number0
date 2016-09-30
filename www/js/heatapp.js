var width = $(window).width();
var height = $(window).height();
var chartcenter = [width/2, width/2];
var page2togle = false;
var p2togled = false;

var global_date = new Date();

var global_temp_set = [45,45,45,45,45,45,45,45,45,45,
                       25,25,25,25,25,25,25,25,25,25,
                       25,25,25,25,25,25,25,25,25,25,
                       25,25,25,25,25,25,25,25,25,25,
                       35,35,35,35,35,35,35,35];
var global_cache = [25,25,25,25,25,25,25,25,25,25,
                      25,25,25,25,25,25,25,25,25,25,
                      25,25,25,25,25,25,25,25,25,25,
                      25,25,25,25,25,25,25,25,25,25,
                      25,25,25,25,25,25,25,25];

var group_temp_set_1 = [45,45,45,45,45,45,45,45,45,45,
                        25,25,25,25,25,25,25,25,25,25,
                        25,25,25,25,25,25,25,25,25,25,
                        25,25,25,25,25,25,25,25,25,25,
                        35,35,35,35,35,35,35,35];
   var group_temp_set_2 = [45,45,45,45,45,45,45,45,45,45,
                           25,25,25,25,25,25,25,25,25,25,
                           35,35,35,35,35,35,35,35,35,35,
                           25,25,25,25,25,25,25,25,25,25,
                           35,35,35,35,35,35,35,35];
   var group_temp_set_3 = [45,45,45,45,45,45,45,45,45,45,
                           25,25,25,25,25,25,25,25,25,25,
                           25,25,25,25,25,25,25,25,25,25,
                           25,25,25,25,25,25,25,25,25,25,
                           45,45,45,45,45,45,45,45];

var timing_set = [45,45,45,45,45,45,45,45,45,45,
                  25,25,25,25,25,25,25,25,25,25,
                  25,25,25,25,25,25,25,25,25,25,
                  25,25,25,25,25,25,25,25,25,25,
                  35,35,35,35,35,35,35,35];
var curve_set = [45,45,45,45,45,45,45,45,45,45,
                 25,25,25,25,25,25,25,25,25,25,
                 25,25,25,25,25,25,25,25,25,25,
                 25,25,25,25,25,25,25,25,25,25,
                 35,35,35,35,35,35,35,35];

var current_group_set = 1;  //0: stop mode |1: group1 |2: group2 |3:group3 |4:timing mode |5: curve mode

var piesec = [1,1,1,1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,1,1,1,
              1,1,1,1,1,1,1,1];

var selectstart = 0;
var selectend = 0;
var selectbackup = [0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0];
var cachemask = [0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0];

var selecttemp = 25;
var selectallow = false;
var updated = false;

var page2durationtime = 0;
var page2temp = 25;

function normalize(invector){
  var length = Math.sqrt(invector[0]*invector[0] + invector[1]*invector[1]);
  var outx = invector[0]/length;
  var outy = invector[1]/length;
  return [outx, outy];
}
function showLocale(objD)
  {
    var index = 0;
      var hh = objD.getHours();
      index += hh*2;
      if(hh<10) hh = '0' + hh;
      var mm = objD.getMinutes();
      if(mm>=30){
        index += 1;
      }
      if(mm<10) mm = '0' + mm;
      d3.selectAll(".timedot").attr("r", function(d,i){
        if(i == index){
          return "5";
        }else{
          return "2";
        }
      });
      var str =hh + ":" + mm ;
      return(str);
  }
function tick()
  {
      var today = new Date();
      //document.getElementById("mainwatch").innerHTML = showLocale(today);
      //document.getElementById("page2currenttime").innerHTML = showLocale(today);
      //document.getElementById("page2bigfromtext").innerHTML = showLocale(today);
      if(page2togle == true){
        if(p2togled == false){
          d3.select("#page2tempblock").attr("fill", "rgb(255,255,255)");
          d3.select("#page2bigtemptext").attr("fill", "black");
          p2togled = true;
        }else{
          d3.select("#page2tempblock").attr("fill", "rgb(100,50,50)");
          d3.select("#page2bigtemptext").attr("fill", "white");
          p2togled = false;
        }
      }
      window.setTimeout(tick , 1000);
  }

  function counttotime(num){
    var time = "";
    if(num/2 < 10){
      time = "0" + Math.floor(num/2);
    }else{
      time = Math.floor(num/2);
    }
    if(num % 2){
        time += ":" + "30";
    }else{
        time += ":" + "00";
    }
    return time;
  }
  function showselect(){
    if((selectend - selectstart) >= 0){
      d3.selectAll(".selectdot").attr("fill", function(d,i){
        if(i <= selectend && i >= selectstart){
          return "rgb(0,255,0)";
        }else{
          return "rgb(100,100,100)";
        }
      });
    }else{
      d3.selectAll(".selectdot").attr("fill", function(d,i){
        if(i >= selectend && i <= selectstart){
          return "rgb(100,100,100)";
        }else{
          return "rgb(0,255,0)";
        }
      });
    }
    d3.select("#fromtimetext").text(counttotime(selectstart));
    d3.select("#tilltimetext").text(counttotime(selectend));

  };

  function disshowselect(){
    d3.selectAll(".selectdot").attr("fill", function(d,i){
      return "rgb(100,100,100)";
    });
    selectstart = 0;
    selectend = 0;
    selecttemp = 25;
    selectallow = false;
    updated = false;
    d3.select("#fromtimetext").text(counttotime(selectstart));
    d3.select("#tilltimetext").text(counttotime(selectend));
    d3.select("#tempsettext").text(selecttemp);
    d3.select("#indicator1").text("");
    d3.select("#indicator2").text("");
  }

  function showindicator(index, pos){
    if(selectstart == selectend){
      var tempvec = normalize(arc.centroid(piedata[index]));
        var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
        if(index >= 0){
          d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "left").text(global_temp_set[index]);
        }else{
          d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "right").text(global_temp_set[index]);
        }
        d3.select("#indicator2").text("");
    }else{
      if(pos == "start"){
        var tempvec = normalize(arc.centroid(piedata[index]));
          var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
          if(index >= 24){
            d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "end").text(global_temp_set[index]);
          }else{
            d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "start").text(global_temp_set[index]);
          }
        }else if(pos == "end"){
          var tempvec = normalize(arc.centroid(piedata[index]));
          var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
          if(index >= 24){
            d3.select("#indicator2").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "end").text(global_temp_set[index]);
          }else{
            d3.select("#indicator2").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "start").text(global_temp_set[index]);
          }
        }
      }
  }

  function changemode(mode){
    var modetext = "";
    switch(mode){
      case 1:
        for(var i1 = 0; i1 <= 47; i1 ++){
          global_temp_set[i1] = group_temp_set_1[i1];
        }
        break;
      case 2:
        for(var i2 = 0; i2 <= 47; i2 ++){
          global_temp_set[i2] = group_temp_set_2[i2];
        }
        break;
      case 3:
        for(var i3 = 0; i3 <= 47; i3 ++){
          global_temp_set[i3] = group_temp_set_3[i3];
        }
        break;
      case 4:
        for(var i4 = 0; i4 <= 47; i4 ++){
          global_temp_set[i4] = timing_set[i4];
        }
        break;
      case 5:
        for(var i5 = 0; i5 <= 47; i5 ++){
          global_temp_set[i5] = curve_set[i5];
        }
        break;
    }
    showglobalset();
    disshowselect();
  }

  function changeglobalmode(mode){
    var modetext = "";
    switch(mode){
      case 1:
        modetext = "CurrentMode Custom-1";
        break;
      case 2:
        modetext = "CurrentMode Custom-2";
        break;
      case 3:
        modetext = "CurrentMode Custom-3";
        break;
      case 4:
        modetext = "CurrentMode Timing";
        break;
      case 5:
        modetext = "CurrentMode Curve";
        break;
    }
    d3.select("#currentsettext").text(modetext);
    d3.select("#currentsettext2").text(modetext);
    d3.select("#currentsettext3").text(modetext);
  }

  function setmode(mode){
    switch(mode){
      case 1:
        for(var i1 = 0; i1 <= 47; i1 ++){
          group_temp_set_1[i1] = global_temp_set[i1] ;
        }
        break;
      case 2:
        for(var i2 = 0; i2 <= 47; i2 ++){
          group_temp_set_2[i2] = global_temp_set[i2];
        }
        break;
      case 3:
        for(var i3 = 0; i3 <= 47; i3 ++){
          group_temp_set_3[i3] = global_temp_set[i3];
        }
        break;
      case 4:
        for(var i4 = 0; i4 <= 47; i4 ++){
          timing_set[i4] = global_temp_set[i4];
        }
        break;
      case 5:
        for(var i5 = 0; i5 <= 47; i5 ++){
          curve_set[i5] = global_temp_set[i5];
        }
        break;
    }
  }
  function showglobalset(){
    d3.selectAll(".tempdot").attr("d", function(d,i){
    return d3.svg.arc()  //弧生成器
            .innerRadius(innerRadius)   //设置内半径
            .outerRadius(linear(global_temp_set[i]))(d);
    });
  }

function counttotime(num){
    var time = "";
    if(num/2 < 10){
      time = "0" + Math.floor(num/2);
    }else{
      time = Math.floor(num/2);
    }
    if(num % 2){
        time += ":" + "30";
    }else{
        time += ":" + "00";
    }
    return time;
  }
function showselect(){
    if((selectend - selectstart) >= 0){
      d3.selectAll(".selectdot").attr("fill", function(d,i){
        if(i <= selectend && i >= selectstart){
          return "rgb(0,255,0)";
        }else{
          return "rgb(100,100,100)";
        }
      });
    }else{
      d3.selectAll(".selectdot").attr("fill", function(d,i){
        if(i >= selectend && i <= selectstart){
          return "rgb(100,100,100)";
        }else{
          return "rgb(0,255,0)";
        }
      });
    }
    d3.select("#fromtimetext").text(counttotime(selectstart));
    d3.select("#tilltimetext").text(counttotime(selectend));

  };
function disshowselect(){
    d3.selectAll(".selectdot").attr("fill", function(d,i){
      return "rgb(100,100,100)";
    });
    selectstart = 0;
    selectend = 0;
    selecttemp = 25;
    selectallow = false;
    updated = false;
    d3.select("#fromtimetext").text(counttotime(selectstart));
    d3.select("#tilltimetext").text(counttotime(selectend));
    d3.select("#tempsettext").text(selecttemp);
    d3.select("#indicator1").text("");
    d3.select("#indicator2").text("");
  }
function showindicator(index, pos){
    if(selectstart == selectend){
      var tempvec = normalize(arc.centroid(piedata[index]));
        var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
        if(index >= 0){
          d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "left").text(global_temp_set[index]);
        }else{
          d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "right").text(global_temp_set[index]);
        }
        d3.select("#indicator2").text("");
    }else{
      if(pos == "start"){
        var tempvec = normalize(arc.centroid(piedata[index]));
          var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
          if(index >= 24){
            d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "end").text(global_temp_set[index]);
          }else{
            d3.select("#indicator1").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "start").text(global_temp_set[index]);
          }
        }else if(pos == "end"){
          var tempvec = normalize(arc.centroid(piedata[index]));
          var tempdest = [tempvec[0]*10 + arc.centroid(piedata[index])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[index])[1] + chartcenter[1]];
          if(index >= 24){
            d3.select("#indicator2").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "end").text(global_temp_set[index]);
          }else{
            d3.select("#indicator2").attr("transform","translate("+ tempdest[0] +","+ tempdest[1] +")").attr("text-anchor", "start").text(global_temp_set[index]);
          }
        }
      }
  }
function changemode(mode){
    var modetext = "";
    switch(mode){
      case 1:
        for(var i1 = 0; i1 < 47; i1 ++){
          global_temp_set[i1] = group_temp_set_1[i1];
        }
        break;
      case 2:
        for(var i2 = 0; i2 < 47; i2 ++){
          global_temp_set[i2] = group_temp_set_2[i2];
        }
        break;
      case 3:
        for(var i3 = 0; i3 < 47; i3 ++){
          global_temp_set[i3] = group_temp_set_3[i3];
        }
        break;
      case 4:
        for(var i4 = 0; i4 < 47; i4 ++){
          global_temp_set[i4] = timing_set[i4];
        }
        break;
      case 5:
        for(var i5 = 0; i5 < 47; i5 ++){
          global_temp_set[i5] = curve_set[i5];
        }
        break;
    }
    showglobalset();
    disshowselect();
  }
function changeglobalmode(mode){
    var modetext = "";
    switch(mode){
      case 1:
        modetext = "CurrentMode Custom-1";
        break;
      case 2:
        modetext = "CurrentMode Custom-2";
        break;
      case 3:
        modetext = "CurrentMode Custom-3";
        break;
      case 4:
        modetext = "CurrentMode Timing";
        break;
      case 5:
        modetext = "CurrentMode Curve";
        break;
    }
    d3.select("#currentsettext").text(modetext);
    d3.select("#currentsettext2").text(modetext);
    d3.select("#currentsettext3").text(modetext);
  }

function initmode(){
  workmode = 0;
  $("#btn27").attr("fill", "rgb(1, 153, 217)");
  $("#btn26").attr("fill", "rgb(231, 126, 35)");
  $("#btn25").attr("fill", "rgb(231, 126, 35)");
  $("#btn24").attr("fill", "rgb(25, 25, 25)");
  $("#btn23").attr("fill", "rgb(25, 25, 25)");
  $("#btn22").attr("fill", "rgb(25, 25, 25)");
  $("#btn21").attr("fill", "rgb(25, 25, 25)");
  $("#btn210").attr("fill", "rgb(1, 153, 217)");
  $("#btn211").attr("fill", "rgb(1, 153, 217)");
  $("#bg1").attr("fill", "rgb(1, 153, 217)");
  $("#bg2").attr("fill", "rgb(1, 141, 196)");
  selectstart = 0;
  selectend = 0;
  selectrounded = false;
  selecttemp = 25;
  $("#starttimetext").text(counttotime(selectstart));
  $("#totimetext").text(counttotime(selectend));
  $("#temptext").text(selecttemp);
  for(var it8 = 0; it8 < 48; it8++){
    global_cache[it8] = 25;
  }
  showmainmassager("In View Mode");
}
function setmode(mode){
    switch(mode){
      case 0:
        workmode = 0;
        $("#btn27").attr("fill", "rgb(1, 153, 217)");
        $("#btn26").attr("fill", "rgb(231, 126, 35)");
        $("#btn25").attr("fill", "rgb(231, 126, 35)");
        $("#btn24").attr("fill", "rgb(25, 25, 25)");
        $("#btn23").attr("fill", "rgb(25, 25, 25)");
        $("#btn22").attr("fill", "rgb(25, 25, 25)");
        $("#btn21").attr("fill", "rgb(25, 25, 25)");
        $("#btn210").attr("fill", "rgb(1, 153, 217)");
        $("#btn211").attr("fill", "rgb(1, 153, 217)");
        $("#bg1").attr("fill", "rgb(1, 153, 217)");
        $("#bg2").attr("fill", "rgb(1, 141, 196)");
        showmainmassager("In View Mode");
        svg.select("#cleartext").text("FATCH");
        svg.select("#updatetext").text("SEND");
        break;
      case 1:
        workmode = 1;
        $("#btn27").attr("fill", "rgb(1, 153, 217)");
        $("#btn26").attr("fill", "rgb(231, 126, 35)");
        $("#btn25").attr("fill", "rgb(231, 126, 35)");
        $("#btn24").attr("fill", "rgb(231, 126, 35)");
        $("#btn23").attr("fill", "rgb(231, 126, 35)");
        $("#btn22").attr("fill", "rgb(231, 126, 35)");
        $("#btn21").attr("fill", "rgb(231, 126, 35)");
        $("#btn210").attr("fill", "rgb(231, 126, 35)");
        $("#btn211").attr("fill", "rgb(231, 126, 35)");
        $("#bg1").attr("fill", "rgb(231, 126, 35)");
        $("#bg2").attr("fill", "rgb(200, 126, 35)");
        showmainmassager("In Edit Mode");
        svg.select("#cleartext").text("CLEAR");
        svg.select("#updatetext").text("UPDATE");
        break;
    }
    selectstart = 0;
    selectend = 0;
    selectrounded = false;
    selecttemp = 25;
    $("#starttimetext").text(counttotime(selectstart));
    $("#totimetext").text(counttotime(selectend));
    $("#temptext").text(selecttemp);
    for(var it8 = 0; it8 < 48; it8++){
      global_cache[it8] = 25;
    }
    redrawpic();
    return;
}
function showglobalset(){
    d3.selectAll(".tempdot").attr("d", function(d,i){
    return d3.svg.arc()  //弧生成器
            .innerRadius(innerRadius)   //设置内半径
            .outerRadius(linear(global_temp_set[i]))(d);
    });
  }



var svg = d3.select("#mainchart")
      .attr("width", width)
      .attr("height", height);
svg.append("rect").attr("x", 0).attr("y", 0).attr("width",width).attr("height",height).attr("fill", "rgb(30,30,30)").attr("id", "bgrect");
/*
var pie = d3.layout.pie();

var piedata = pie(piesec);

var linear = d3.scale.linear().domain([25, 65]).range([width*0.2, width*0.65]);

var outerRadius = linear(65);	//外半径
var innerRadius = linear(25);	//内半径，为0则中间没有空白

var arc = d3.svg.arc()	//弧生成器
      .innerRadius(innerRadius)	//设置内半径
      .outerRadius(outerRadius);	//设置外半径

var color = d3.scale.category10();

var arcs = svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform","translate("+ (width/2) +","+ (width/2) +")");


arcs.append("path")
    .attr("fill","rgba(200,0,0, 0.9)")
    .attr("d",function(d,i){
        return d3.svg.arc()  //弧生成器
            .innerRadius(innerRadius)   //设置内半径
            .outerRadius(linear(global_temp_set[i]))(d);
    })
    .attr("class", "tempdot");

arcs.append("path")
    .attr("fill","rgb(100,100,100)")
    .attr("d",function(d,i){
        return d3.svg.arc()  //弧生成器
            .innerRadius(innerRadius-5)   //设置内半径
            .outerRadius(innerRadius)(d);
    })
    .attr("class", "selectdot");

arcs.append("circle")
    .attr("transform",function(d){
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("r","2").attr("fill", "rgb(200,200,200)").attr("class", "timedot");

    var tempvec = normalize(arc.centroid(piedata[0]));
    var tempdest = [tempvec[0]*10 + arc.centroid(piedata[0])[0] + chartcenter[0], tempvec[1]*10 + arc.centroid(piedata[0])[1] + chartcenter[1]];
*/

var padding = {left:30, right:30, top:60, bottom:10};
var rectPadding = 2;
var xScale = d3.scale.ordinal()
                     .domain(d3.range(global_temp_set.length))
                     .rangeRoundBands([0, width - padding.left - padding.right]);
var yScale = d3.scale.linear()
                     .domain([25, 45])
                     .range([height*0.4 - padding.top - padding.bottom, 0]);
var xAxis = d3.svg.axis()
                 .scale(xScale)      //指定比例尺
                 .orient("bottom")   //指定刻度的方向
                 .tickValues([0,11,23,35,47])
                 .tickFormat(function(d){
                   if(d == 0){
                     return "00:00";
                   }else if(d == 11){
                     return "06:00";
                   }else if(d == 23){
                     return "12:00";
                   }else if(d == 35){
                     return "18:00";
                   }else if(d == 47){
                     return "23:30";
                   }
                 });
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(20);

svg.append("g")
   .attr("class","axis")
   .attr("transform","translate(" + padding.left + "," + (height*0.4 - padding.bottom) + ")")
   .call(xAxis);

                  //添加y轴
svg.append("g")
   .attr("class","axis")
   .attr("transform","translate(" + padding.left + "," + padding.top + ")")
   .call(yAxis);

svg.append("circle")
   .attr("id", "fromindi")
   .attr("transform","translate(" + padding.left + "," + (padding.top - 20) + ")")
   .attr("r", "3")
   .attr("fill", "rgb(231, 126, 35)");
svg.append("circle")
  .attr("id", "toindi")
  .attr("transform","translate(" + padding.left + "," + (padding.top - 20) + ")")
  .attr("cx", "-1000")
  .attr("r", "3")
  .attr("fill", "rgb(231, 126, 35)");
svg.append("rect")
   .attr("id", "fromline")
   .attr("transform","translate(" + padding.left + "," + (padding.top - 20) + ")")
   .attr("width", "1")
   .attr("fill", "rgb(231, 126, 35)")
   .attr("height", function(d){
       return height*0.4 - padding.top - padding.bottom + 20;
   });
svg.append("rect")
  .attr("id", "toline")
  .attr("transform","translate(" + padding.left + "," + (padding.top - 20) + ")")
  .attr("width", "1")
  .attr("fill", "rgb(231, 126, 35)")
  .attr("x", "-1000")
  .attr("height", function(d){
      return height*0.4 - padding.top - padding.bottom + 20;
  });
svg.append("text")
   .attr("id", "fromnote")
   .attr("transform","translate(" + (padding.left + 5) + "," + (padding.top - 20) + ")")
   .attr("text-anchor", "middle")
   .attr("fill", "rgb(231, 126, 35)")
   .attr("font-weight", "bold")
   .text(global_temp_set[selectstart] + " C");
svg.append("text")
  .attr("id", "tonote")
  .attr("transform","translate(" + (padding.left + 5) + "," + (padding.top - 20) + ")")
  .attr("text-anchor", "middle")
  .attr("fill", "rgb(231, 126, 35)")
  .attr("font-weight", "bold")
  .attr("x", "-1000")
  .text(global_temp_set[selectend] + " C");

var rects = svg.selectAll(".MyRect")
           .data(global_temp_set)
           .enter()
           .append("rect")
           .attr("class","MyRect")
           .attr("transform","translate(" + padding.left + "," + padding.top + ")")
           .attr("width", xScale.rangeBand() - rectPadding/2)
           .attr("x", function(d,i){
               return xScale(i) + (xScale.rangeBand() - rectPadding/2)/2;
           } )
           .attr("y",function(d){
               return yScale(d);
           })
           .attr("height", function(d){
               return height*0.4 - padding.top - padding.bottom - yScale(d);
           })
           .attr("fill", "rgb(237, 110, 70)");

function redrawpic(){
  for(var it5 = 0; it5 < 48; it5++){
    if(global_cache[it5] == 25){
      cachemask[it5] = 1;
      global_cache[it5] = global_temp_set[it5];
    }
  }
  svg.selectAll(".MyRect").data(global_cache).attr("y",function(d){
      return yScale(d);
  }).attr("height", function(d){
    return height*0.4 - padding.top - padding.bottom - yScale(d);
  }).attr("fill", function(d,i){
    if(cachemask[i] != 1){
      return "rgb(219, 190, 184)";
    }else{
      return "rgb(237, 110, 70)";
    }
  });
  for(var it6 = 0; it6 < 48; it6++){
    if(cachemask[it6] == 1){
      global_cache[it6] = 25;
    }
    cachemask[it6] = 0;
  }
  if(workmode == 1){
    svg.select("#toline").attr("x", function(d){
      return xScale(selectend) + (xScale.rangeBand() - rectPadding/2)/2;
    });
    svg.select("#toindi").attr("cx", function(d){
      return xScale(selectend) + (xScale.rangeBand() - rectPadding/2)/2;
    });
    svg.select("#tonote").attr("x", function(d){
      return xScale(selectend) + 10 + (xScale.rangeBand() - rectPadding/2)/2;
    }).text(global_temp_set[selectend] + "C");
  }else{
    svg.select("#toline").attr("x", function(d){
      return xScale(selectend) - 1000 + (xScale.rangeBand() - rectPadding/2)/2;
    });
    svg.select("#toindi").attr("cx", function(d){
      return xScale(selectend) - 1000 + (xScale.rangeBand() - rectPadding/2)/2;
    });
    svg.select("#tonote").attr("x", function(d){
      return xScale(selectend) + 10 - 1000 + (xScale.rangeBand() - rectPadding/2)/2;
    }).text(global_temp_set[selectend] + "C");
  }
  svg.select("#fromline").attr("x", function(d){
    return xScale(selectstart) + (xScale.rangeBand() - rectPadding/2)/2;
  });
  svg.select("#fromindi").attr("cx", function(d){
    return xScale(selectstart) + (xScale.rangeBand() - rectPadding/2)/2;
  });
  svg.select("#fromnote").attr("x", function(d){
    return xScale(selectstart) + 10 + (xScale.rangeBand() - rectPadding/2)/2;
  }).text(global_temp_set[selectstart] + "C");
}

var selectrounded = false;
function updatecache(){
    if(selectend > selectstart){
      for(var it1 = 0; it1 < 48; it1++){
        if(it1 >= selectstart && it1 < selectend){
          global_cache[it1] = selecttemp;
        }else{
          global_cache[it1] = 25;
        }
      }
    }else if(selectend < selectstart){
      for(var it2 = 0; it2 < 48; it2++){
        if(it2 >= selectend && it2 < selectstart){
          global_cache[it2] = 25;
        }else{
          global_cache[it2] = selecttemp;
        }
      }
    }else{
      if(selectrounded){
        for(var it3 = 0; it3 < 48; it3++){
          global_cache[it3] = selecttemp;
        }
      }else{
        for(var it3 = 0; it3 < 48; it3++){
          global_cache[it3] = 25;
        }
      }
    }
    redrawpic();
}
function updateglobaltemp(){
    for(var it4 = 0; it4 < 48; it4++){
      if(global_cache[it4] != 25){
        global_temp_set[it4] = global_cache[it4];
      }
      global_cache[it4] = 25;
    }
    selectstart = selectend;
    selectrounded = false;
}
function showmainmassager(mes){
  svg.select("#mainmassager")
     .transition()
     .duration(200)
     .text(mes);
}
// page-2/////////////////////////////////////////
svg.append("rect").attr("x", width*0.7).attr("y", height*0.80).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn21");
svg.append("rect").attr("x", width*0.7).attr("y", height*0.65).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn22");
svg.append("rect").attr("x", width*0.4).attr("y", height*0.80).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn23");
svg.append("rect").attr("x", width*0.4).attr("y", height*0.65).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn24");
svg.append("rect").attr("x", width*0.1).attr("y", height*0.80).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn25");
svg.append("rect").attr("x", width*0.1).attr("y", height*0.65).attr("rx", 5).attr("width",width*0.2).attr("height",width*0.08).attr("fill", "rgb(0,0,0)").attr("id", "btn26");
svg.append("rect").attr("x", width*0).attr("rx", 10).attr("y", height*0.45 + width*0.1).attr("width",width*1).attr("height",width*0.1).attr("fill", "rgb(0,0,0)").attr("id", "btn27");
svg.append("rect").attr("x", width*0.25).attr("y", height*0.90).attr("width",width*0.5).attr("height",height*0.1).attr("fill", "rgb(1, 153, 217)").attr("id", "bg1");
svg.append("rect").attr("x", width*0).attr("y", height*0.90).attr("rx", 10).attr("width",width*0.5).attr("height",height*0.1).attr("fill", "rgb(0,0,0)").attr("id", "btn210");
svg.append("rect").attr("x", width*0.5).attr("y", height*0.90).attr("rx", 10).attr("width",width*0.5).attr("height",height*0.1).attr("fill", "rgb(0,0,0)").attr("id", "btn211");
svg.append("rect").attr("x", width*0.5-1).attr("y", height*0.90).attr("width",1).attr("height",height*0.1).attr("fill", "rgb(1, 141, 196)").attr("id", "bg2");
svg.append("rect").attr("x", width*0).attr("y", height*0.45).attr("width",width).attr("height",width*0.1).attr("fill", "rgb(30,30,30)").attr("id", "btn213");
svg.append("rect").attr("x", 20).attr("y", height*0.45).attr("width",width-40).attr("height",1).attr("fill", "rgb(35,35,35)");
svg.append("text").attr("transform","translate("+ width*0.5 +","+ height*0.49 +")").attr("text-anchor", "middle").attr("fill", "rgb(150,150,150)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("Welcome").attr("id", "mainmassager");

svg.append("text").attr("transform","translate("+ width*0.5 +","+ (height*0.45 + width*0.155) +")").attr("text-anchor", "middle").attr("fill", "rgba(255,255,255,0.9)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("StartEdit");
svg.append("text").attr("transform","translate("+ width*0.25 +","+ height*0.95 +")").attr("text-anchor", "middle").attr("fill", "rgba(255,255,255,0.9)").attr("font-family", "Lucida Console").attr("font-weight", "bold").attr("id", "cleartext").text("CLEAR");
svg.append("text").attr("transform","translate("+ width*0.75 +","+ height*0.95 +")").attr("text-anchor", "middle").attr("fill", "rgba(255,255,255,0.9)").attr("font-family", "Lucida Console").attr("font-weight", "bold").attr("id", "updatetext").text("UPDATE");

svg.append("text").attr("transform","translate("+ width*0.2 +","+ height*0.62 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("FROM");
svg.append("text").attr("transform","translate("+ width*0.2 +","+ height*0.75 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("00:00").attr("id", "starttimetext");
svg.append("text").attr("transform","translate("+ width*0.5 +","+ height*0.62 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("TO");
svg.append("text").attr("transform","translate("+ width*0.5 +","+ height*0.75 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("00:00").attr("id", "totimetext");
svg.append("text").attr("transform","translate("+ width*0.8 +","+ height*0.62 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("Temperature");
svg.append("text").attr("transform","translate("+ width*0.8 +","+ height*0.75 +")").attr("text-anchor", "middle").attr("fill", "rgb(55,55,55)").attr("font-family", "Lucida Console").attr("font-weight", "bold").text("25").attr("id", "temptext");


$("#btn26").click(function(){
  if(workmode == 1){
    if(selectstart == selectend){
      if(selectrounded != true){
        selectstart += 1;
        selectend += 1;
        if(selectstart > 47){
          selectstart = 0;
        }
        if(selectend > 47){
          selectend = 0;
        }
      }else{
        selectstart += 1;
        if(selectstart > 47){
          selectstart = 0;
        }
        selectrounded = false;
      }
    }else{
      selectstart += 1;
      if(selectstart > 47){
        selectstart = 0;
      }
    }
    updatecache();
    $("#starttimetext").text(counttotime(selectstart));
    //showindicator(selectstart, "start");
    //showselect();
  }else{
    selectstart += 1;
    selectend += 1;
    if(selectstart > 47){
      selectstart = 0;
    }
    if(selectend > 47){
      selectend = 0;
    }
    updatecache();
    $("#starttimetext").text(counttotime(selectstart));
  }
});
$("#btn25").click(function(){
  if(workmode == 1){
    if(selectstart == selectend){
      selectstart -= 1;
      selectend -= 1;
      if(selectstart < 0){
        selectstart = 47;
      }
      if(selectend < 0){
        selectend = 47;
      }
    }else{
      selectstart -= 1;
      if(selectstart < 0){
        selectstart = 47;
      }
      if(selectstart == selectend){
        selectrounded = true;
      }
    }
    selectallow = true;
    updated = false;
    updatecache();
    $("#starttimetext").text(counttotime(selectstart));
    //showindicator(selectstart, "start");
    //showselect();
  }else{
    selectstart -= 1;
    selectend -= 1;
    if(selectstart < 0){
      selectstart = 47;
    }
    if(selectend < 0){
      selectend = 47;
    }
    updatecache();
    $("#starttimetext").text(counttotime(selectstart));
  }
});
$("#btn24").click(function(){
  if(workmode == 1){
    if(selectstart == selectend){
      if(selectrounded != true){
        selectend += 1;
        if(selectend > 47){
          selectend = 0;
        }
      }
    }else{
      selectend += 1;
      if(selectend > 47){
        selectend = 0;
      }
      if(selectstart == selectend){
        selectrounded = true;
      }
    }
    updatecache();
    $("#totimetext").text(counttotime(selectend));
    //showindicator(selectend, "end");
    //showselect();
  }
});
$("#btn23").click(function(){
  if(workmode == 1){
    if(selectstart == selectend){
      if(selectrounded == true){
        selectend -= 1;
        if(selectend < 0){
          selectend = 47;
        }
        selectrounded = false;
      }
    }else{
      selectend -= 1;
      if(selectend < 0){
        selectend = 47;
      }
    }
    updatecache();
    $("#totimetext").text(counttotime(selectend));
    //showindicator(selectend, "end");
    //showselect();
  }
});
$("#btn22").click(function(){
  if(workmode == 1){
    selecttemp += 1;
    if(selecttemp > 45){
      selecttemp = 45;
    }
    updatecache();
    $("#temptext").text(selecttemp);
    d3.select("#tempsettext").text(selecttemp);
  }
});
$("#btn21").click(function(){
  if(workmode == 1){
    selecttemp -= 1;
    if(selecttemp < 25){
      selecttemp = 25;
    }
    updatecache();
    $("#temptext").text(selecttemp);
    d3.select("#tempsettext").text(selecttemp);
  }
});
$("#btn210").click(function(){
  if(workmode == 1){
    for(var it0 = 0; it0 < 48; it0++){
    global_temp_set[it0] = 25;
    global_cache[it0] = 25;
    }
    selectstart = 0;
    selectend = 0;
    selectrounded = false;
    redrawpic();
  }else if(workmode == 0){
    if(buttonlocked == true){
      readwholesetting();
    }
  }
});
$("#btn211").click(function(){
  if(workmode == 1){
    updateglobaltemp();
    redrawpic();
    //changeglobalmode(global_temp_set);
  }else if(workmode == 0){
    if(buttonlocked == true){
      writewholesetting();
    }
  }
});

var workmode = 0 ; // 0 view mode ,   1 edit mode
$("#btn27").click(function(){
  if(workmode == 0){
    setmode(1);
  }else if(workmode == 1){
    setmode(0);
  }
});
////////////////////////////////////////////  Bluepage Part////////////////////////////////////////////////
var focusedblueset = 0;
var buttonlocked = false;
var bluesetstore = {
  set1 : {
    devicemac : "00:15:83:00:3C:6B",
    devicename : "test"
  },
  set2 : {
    devicemac : null,
    devicename : null
  },
  set3 : {
    devicemac : null,
    devicename : null
  }
};
//var bluesetstate = {button0 : true, button1 : false, button2 : false, button3 : false};
function initbluepage(){
  $("#blueset0").show();
  $("#blueset1").hide();
  $("#blueset2").hide();
  $("#blueset3").hide();
  $("#bluebutton1").css("background", "rgb(231, 126, 35)");
  $("#bluebutton2").css("background", "rgb(231, 126, 35)");
  $("#bluebutton3").css("background", "rgb(231, 126, 35)");
}
function showbluepageset(num){
  $("#blueset0").hide();
  $("#blueset1").hide();
  $("#blueset2").hide();
  $("#blueset3").hide();
  $("#bluebutton1").css("background", "rgb(231, 126, 35)");
  $("#bluebutton2").css("background", "rgb(231, 126, 35)");
  $("#bluebutton3").css("background", "rgb(231, 126, 35)");
  var tempbu = "#blueset" + num;
  $(tempbu).show();
  if(num != 0){
    tempbu  = "#bluebutton" + num;
    $(tempbu).css("background", "rgb(25,25,25)");
  }
  focusedblueset = num;
}

$("#bluebutton1").click(function(){
  if(buttonlocked != true){
    if(focusedblueset != 1){
      showbluepageset(1);
    }else{
      showbluepageset(0);
    }
  }
  $("#notiin").text("No Device Connected");
});
$("#bluebutton2").click(function(){
  if(buttonlocked != true){
    if(focusedblueset != 2){
      showbluepageset(2);
    }else{
      showbluepageset(0);
    }
  }
  $("#notiin").text("No Device Connected");
});
$("#bluebutton3").click(function(){
  if(buttonlocked != true){
    if(focusedblueset != 3){
      showbluepageset(3);
    }else{
      showbluepageset(0);
    }
  }
  $("#notiin").text("No Device Connected");
});
$("#fatchbutton").click(function(){
  if(buttonlocked == true){
    readwholesetting();
  }
});
$("#sendbutton").click(function(){
  if(buttonlocked == true){
    writewholesetting();
  }
});
$("#blueset1device").focus(function(){
  $("#blueset1device").val(bluesetstore.set1.devicemac);
  $("#blueset1device").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set1.devicemac = $("#blueset1device").val();
  $("#blueset1device").css("background", "rgb(25,25,25)");
});
$("#blueset1name").focus(function(){
  $("#blueset1name").val(bluesetstore.set1.devicename);
  $("#blueset1name").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set1.devicename = $("#blueset1name").val();
  $("#blueset1name").css("background", "rgb(25,25,25)");
});
$("#blueset2device").focus(function(){
  $("#blueset2device").val(bluesetstore.set2.devicemac);
  $("#blueset2device").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set2.devicemac = $("#blueset2device").val();
  $("#blueset2device").css("background", "rgb(25,25,25)");
});
$("#blueset2name").focus(function(){
  $("#blueset2name").val(bluesetstore.set2.devicename);
  $("#blueset2name").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set2.devicename = $("#blueset2name").val();
  $("#blueset2name").css("background", "rgb(25,25,25)");
});
$("#blueset3device").focus(function(){
  $("#blueset3device").val(bluesetstore.set3.devicemac);
  $("#blueset3device").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set3.devicemac = $("#blueset3device").val();
  $("#blueset3device").css("background", "rgb(25,25,25)");
});
$("#blueset3name").focus(function(){
  $("#blueset3name").val(bluesetstore.set3.devicename);
  $("#blueset3name").css("background", "rgb(55,55,55)");
}).blur(function(){
  bluesetstore.set3.devicename = $("#blueset3name").val();
  $("#blueset3name").css("background", "rgb(25,25,25)");
});

function getcurrentmac(){
  var tempmac = null;
  if(focusedblueset == 1){
    tempmac = $.trim(bluesetstore.set1.devicemac);
  }else if(focusedblueset == 2){
    tempmac = $.trim(bluesetstore.set2.devicemac);
  }else if(focusedblueset == 3){
    tempmac = $.trim(bluesetstore.set3.devicemac);
  }
  return tempmac;
}
var pandingindex = 0;
function writewholeerror(){
  pandingindex = 0;
  $("#notiin").text("Sending Data Error");
}
function writewholesetting(){
  var data = new Uint8Array(10);
  if(pandingindex != 6){
    for(var it12 = 0; it12 < 8; it12 ++){
      data[it12 + 2] = global_temp_set[it12 + pandingindex*8];
    }
    data[0] = 1;
    data[1] = pandingindex;
    pandingindex += 1;
    ble.writeCommand(getcurrentmac(), heatcartid.serviceUUID, heatcartid.txCharacteristic, data.buffer, writewholesetting, writewholeerror);
  }else{
    pandingindex = 0;
    $("#notiin").text("Sending Data Success");
  }
}
function readwholesuccess(){
  $("#notiin").text("Fatching Data");
}
function readwholesetting(){
  var data = new Uint8Array(10);
  data[0] = 0;
  data[1] = 0;
  pandingindex = 0;
  $("#notiin").text("Starting To Fatch Data");
  ble.writeCommand(getcurrentmac(), heatcartid.serviceUUID, heatcartid.txCharacteristic, data.buffer, readwholesuccess, writewholeerror);
}
function blueonnotifydata(buffer){
  var data = new Uint8Array(buffer);
  var partn = data[1]; // partn -> [0 5]
  if(pandingindex == partn){
    for(var it10 = 0; it10 < 8; it10++){
      global_temp_set[it10 + partn*8] = data[it10 + 2];
    }
    pandingindex += 1;
    if(pandingindex == 6){
      updatecache();
      pandingindex = 0;
      $("#notiin").text("Successfully Fatching Data");
    }
  }else{
    for(var it11 = 0; it11 < 48; it11++){
      global_temp_set[it11] = 25;
    }
    pandingindex = 0;
    updatecache();
    $("#notiin").text("Fatching Data Error");
  }
}
function blueonnotifydatafail(){
  $("#notiin").text("Notification Failed");
}
function blueonconnect(){
  var temp1 = "blueset" + focusedblueset;
  $(temp1).css("background", "rgb(0,200,0)");
  $("#notiin").text("Device" + focusedblueset + "Connected");
  $("#bluenoti-inner").css("background-color", "rgb(231, 126, 35)");
  ble.startNotification(getcurrentmac(), heatcartid.serviceUUID, heatcartid.rxCharacteristic, blueonnotifydata, blueonnotifydatafail);
}

function blueonconnectfail(){
  var temp2 = "blueset" + focusedblueset;
  $(temp2).css("background", "rgb(255,255,255)");
  $("#notiin").text("Connecting failed");
  buttonlocked = false;
  $("#blueset1device").attr("disable", "false");
  $("#blueset1name").attr("disable", "false");
  $("#blueset2device").attr("disable", "false");
  $("#blueset2name").attr("disable", "false");
  $("#blueset3device").attr("disable", "false");
  $("#blueset3name").attr("disable", "false");
  $("#bluenoti-inner").css("background-color", "rgb(25, 25, 25)");
}
$("#blueconbutton1").click(function(){
  if(focusedblueset != 0 && buttonlocked == false){
    ble.connect(getcurrentmac(), blueonconnect, blueonconnectfail);
    // startanimation
    buttonlocked = true;
    $("#blueset1device").attr("disable", "true");
    $("#blueset1name").attr("disable", "true");
    $("#blueset2device").attr("disable", "true");
    $("#blueset2name").attr("disable", "true");
    $("#blueset3device").attr("disable", "true");
    $("#blueset3name").attr("disable", "true");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, wgotFS, fail);
  }
});
function ondisconnect(){
  var temp6 = "blueset" + focusedblueset;
  $(temp6).css("background", "rgb(255,255,255)");
  $("#notiin").text("No Device Connected");
  buttonlocked = false;
  $("#blueset1device").attr("disable", "false");
  $("#blueset1name").attr("disable", "false");
  $("#blueset2device").attr("disable", "false");
  $("#blueset2name").attr("disable", "false");
  $("#blueset3device").attr("disable", "false");
  $("#blueset3name").attr("disable", "false");

  $("#bluenoti-inner").css("background-color", "rgb(25, 25, 25)");
}
function ondisconnectfail(){
  $("#notiin").text("Try Disconnecting Again");
}
$("#blueconbutton2").click(function(){
  if(focusedblueset != 0 && buttonlocked == true){
    ble.disconnect(getcurrentmac(), ondisconnect, ondisconnectfail);
    // startanimation
  }
});
function cssadjust(){
  var wheight = $(window).height();
  var wwidth = $(window).width();
  $("#logo").css("height", wheight * 0.20);
  $("#bluenoti").css("height", wheight * 0.10);
  $("#bluenoti-inner").css("height", wheight * 0.10);
  $("#bluesetframe").css("height", wheight * 0.4);
  $("#blueset0").css("height", wheight * 0.3);
  $("#blueset1").css("height", wheight * 0.3);
  //$(".bluesetmiddle").css("height", wheight * 0.2);
  $("#blueset2").css("height", wheight * 0.3);
  $("#blueset3").css("height", wheight * 0.3);
  $("input").css("width", wwidth - wheight * 0.1 - 40);
  $("#bluesetinner1").css({"height": wheight * 0.2,
                           "top": wheight * 0.05,
                           "width" : wwidth - wheight * 0.1 - 40,
                           "left": wheight * 0.05
                          });
  $("#bluesetinner2").css({"height": wheight * 0.2,
                           "top": wheight * 0.05,
                           "width" : wwidth - wheight * 0.1 - 40,
                           "left": wheight * 0.05
                          });
  $("#bluesetinner3").css({"height": wheight * 0.2,
                           "top": wheight * 0.05,
                           "width" : wwidth - wheight * 0.1 - 40,
                           "left": wheight * 0.05
                          });
  $("#bluesetinner2").css("height", wheight * 0.2);
  $("#bluesetinner3").css("height", wheight * 0.2);
  $("#bluebuttongroup").css("height", wheight * 0.1);
  $("#bluebutton1").css("height", wheight * 0.1);
  $("#bluebutton2").css("height", wheight * 0.1);
  $("#bluebutton3").css("height", wheight * 0.1);
  $("#blueconbuttons").css("height", wheight * 0.15);
  $("#blueconbutton1").css("height", wheight * 0.15);
  $("#blueconbutton1").css("width", (wwidth - 40)/2);
  $("#blueconbutton2").css("height", wheight * 0.15);
  $("#blueconbutton2").css("width", (wwidth - 40)/2);
  $("#blank").css("height", wheight * 0.15);
  $("#blank-inner").css("height", wheight * 0.15);
  middletext(".vmiddle");
}
function middletext(ele){
  $(ele).each(function(){
    $(this).css("left", $(this).parent().width()/2 - $(this).width()/2);
    $(this).css("top", $(this).parent().height()/2 - $(this).height()/2);
  });
  //var eh = $(ele).height();
  //var ph = $(ele).parent().height();
  //var dl = ph/2 - eh/2;
  //$(ele).css("top", dl);
}
////////////////////////////////////////////  Init Part  ///////////////////////////////////////////////////
initmode();
initbluepage();
cssadjust();
tick();
