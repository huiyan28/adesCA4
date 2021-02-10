let monitorIndex = 0;
var intervalArr = [];

async function myRequest(url) {
    const host = 'https://ades-2b01.herokuapp.com';
    try {
        return await axios.get(host + url);
    } catch (err) {
        console.log('myRequest error', err)
    }
}

function getQueue2() {
    console.log('nicholasCounter', monitorIndex++);
    const d = $(`<div id='form` + monitorIndex + `'>`);
    d.addClass("col");
    d.html(
        `<form class="py-3" id='form-layout`+ monitorIndex + `'>
            <div class="form-container">
                <div class="form-row" style="display: flex; justify-content: flex-end">
                    <button type="button" onclick="closeButton(`+monitorIndex +`)" class="btn cancel" style="display: flex; border: none; background-color: white; float: right"><i class="fa fa-close"></i></button>
                </div>
                <div class="form-group row">
                    <label for="companyID" class="col-3 col-form-label">Company ID</label>
                    <div class="col-4">
                        <input type="text" class="py-1 px-0" name="companyid" id="companyid` + monitorIndex +`"  />
                        <input type="hidden" value='` +monitorIndex +`' id="trackerid` +monitorIndex +`">
                    </div>
                    <div class="col-3">
                        <button id="submitBtn" class="py-1" type="button" onclick="searchBtn(` + monitorIndex +`)"  name="submit">Submit</button>
                    </div>
                    <div class="col-2">
                        <img src="./images/loader.gif" id="animation`+ monitorIndex +`" style="visibility: hidden;">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="queueID" class="col-3 col-form-label">Queue ID</label>
                    <div class="col-4">
                        <select name="queueid" id="selection` +monitorIndex +`" onchange="arrivalRate(` +monitorIndex +`)" >
                            <option value="empty"></option>
                        </select>
                    </div>
                    <div class="col-5">
                        <div class="inactive-row">
                            <input type="checkbox" id="cb` +monitorIndex +`" name="cb` +monitorIndex +`" onChange="searchBtn(` +monitorIndex +`)" checked/>
                            <label for="cb">Hide Inactive</label>
                        </div>
                    </div>
                </div>
                <div class="chartDiv" id="addChart`+monitorIndex+`"></div>
                <div id="errMsg` + monitorIndex + `" style="display: flex; justify-content: center; align-items: center;"></div>
            </div>
        </form>`);
    $("#track").append(d);
}
function closeButton(i) {
    $("#form" + i).remove();
    $(`#err` + i).remove();
    var int = intervalArr[i];
    clearInterval(int);
    console.log("Graph has been closed and back-end fetching has been stopped!");
}

function searchBtn(i) {
    $(`#err` + i).remove();
    const trackerid = document.getElementById("trackerid" + i).value;
    const id = document.getElementById("companyid" + trackerid).value;
    const cb = document.getElementById("cb" + i);
    var ind = i;
    console.log(id);
    $(`#selection` + trackerid).empty();

    //clear graph + remove backend requests
    clearInterval(intervalArr[i]);
    $('#myChart' + i).remove();
    
    if (id != "") {
        myRequest(`/company/queue?company_id=${id}`)
            .then($("#animation" + ind).css("visibility", "visible"))
            .then(success => { 
                $("#animation" + ind).css("visibility", "hidden");
                if(success == undefined) {
                    $(`#errMsg` + ind).append(`<a id='err` + ind + `' style="color: red;"><b>CompanyID does not exist!</b></a>`);
                } else if (success.data.length == 0) {
                    $(`#errMsg` + ind).append(`<a id='err` + ind + `' style="color: red;"><b>Company `+ id +` does not have queues!</b></a>`);
                } else {
                    if (cb.checked == true) {
                        $(`#selection` + trackerid).append(`<option id='optionsid` + trackerid + `' value='empty'>-- Select An Option--</option>`);
                        for (var i = 0; i < success.data.length; i++) {
                            const status = `${success.data[i].is_active}`;
                            if (status == 1) {
                                const postHtml = `${success.data[i].queue_id}`
                                var optionHTML = `<option id='optionsid` + trackerid + `' value='` + postHtml + `'>` + postHtml + `</option>`
                                $(`#selection` + trackerid).append(optionHTML);
                            }
                        }
                    } else {
                        $(`#selection` + trackerid).append(`<option id='optionsid` + trackerid + `' value='empty'>-- Select An Option--</option>`);
                        for (var i = 0; i < success.data.length; i++) {
                            var postHtml = `${success.data[i].queue_id}`
                            const status = `${success.data[i].is_active}`;
                            var optionHTML;
                            if (status == 0) {
                                optionHTML = `<option id='optionsid` + trackerid + `' value='inactive'>` + postHtml + ` [X]</option>`
                            } else {
                                optionHTML = `<option id='optionsid` + trackerid + `' value='` + postHtml + `'>` + postHtml + `</option>`
                            }
                            $(`#selection` + trackerid).append(optionHTML);
                        }
                    }
                }
            })
    } else {
        $(`#errMsg` + ind).append(`<a id='err` + ind + `' style="color: red;"><b>Please key in Company ID</b></a>`);
    }
}

function arrivalRate(i) {
    $(`#err` + i).remove();
    const trackerid = document.getElementById("trackerid" + i).value;
    const queueid = document.getElementById("selection" + i).value;
    var labels = [0, 0, 0, 0, 0];
    var dataset = new Array(5);
    
    var updateChart = function updateChart() {
        var m = moment().add(-180,'s');
        console.log(`http://localhost:8080/company/arrival_rate?queue_id=${queueid}&from=${m.toISOString(m)}&duration=1`);
        myRequest(`/company/arrival_rate?queue_id=${queueid}&from=${m.toISOString(m)}&duration=1`)
        .then( $("#animation" + i).css("visibility", "visible"))
        .then(success => {
            $("#animation" + i).css("visibility", "hidden"); 
            var timestamp = success.data[0].timestamp;
            var count = success.data[0].count;
            massPopChart.data.datasets[0].data.shift();
            massPopChart.data.datasets[0].data.push(count);
            massPopChart.data.labels.shift();
            massPopChart.data.labels.push(timestamp);
            massPopChart.update();
        })
    }
    //clear chart
    clearInterval(intervalArr[i]);
    $('#myChart' + i).remove();
    //check if queue exists/is active
    if(queueid == "empty") {
        $(`#errMsg` + i).append(`<a id='err` + i + ` style="color: red;'><b>Error checking queue. Does queue exist?</b></a>`);
    } else if (queueid == 'inactive') {
        $(`#errMsg` + i).append(`<a id='err` + i + `' style="color: red;"><b>Queue is inactive</b></a>`);
    } else {
       //create and add new canvas
       $("#addChart" + i).append(`<canvas id="myChart` + i + `"></canvas>`);
       //get chart
       var myChart = document.getElementById('myChart' + trackerid).getContext('2d');
       //create chart
       var massPopChart = new Chart(myChart, {
           type: 'line',
           data: {
               labels: labels,
               datasets: [{
                   label: 'Count',
                   data: dataset,
                   backgroundColor: 'red'
               }]
           },
           options: {
               title: {
                   display: true,
                   text: 'Queue ID: ' + queueid
               },
               legend: {
                   display: 'false'
               }
           }
       });
       interval = setInterval(updateChart, 3000);
       intervalArr[i] = interval;
    }
}

