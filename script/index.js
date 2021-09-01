
/*var data = {
    20201201: [
        {
            id: "15342affss424",
            val: "Sign up for SAT",
            type: "task",
            complete: true,
        },
    ],
    20210322: [
        {
            id: "15342affss424",
            val: "Drink Milk tea",
            type: "task",
            complete: true,
        },
    ],
    20210202: [
        {
            id: "15342affss424",
            val: "Scary",
            type: "task",
            complete: true,
        },
        {
            id: "15342affss424",
            val: "Remember to die",
            type: "task",
            complete: true,
        },
    ],
    20210203: [
        {
            id: "15342affss424",
            val: "Buy cake for Sandy",
            type: "task",
            complete: true,
        },
    ],
    20210328: [
        {
            id: "15342424",
            val: "go take a shower",
            type: "task",
            complete: true,
        },
        {
            id: "123422",
            val: "Finish math homework",
            type: "task",
            complete: false,
        }
    ],
    20210329: [
        {
            id: "1323232",
            val: "Finish Biology",
            type: "task",
            complete: false,
        }
    ]

}*/

var mobile = false;
if ($(window).width() < 600) {
    mobile = true;
 }
 
function init(){

    $('.day').remove();

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));
    var row; var col; var datecycle = lastSunday;

    // creating the calendar
    for (row=0; row<5; row++){
        var week = $('<tr>').appendTo('.table');
        for (col=0;col<7;col++){
            var dateid = formatDate(datecycle);
            var dayblock = $('<td>').appendTo(week).addClass('day').attr('id', dateid);
            var topbar = $('<div>').addClass('top').appendTo(dayblock);
            var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            if (!mobile){var daynum = $('<p>').text(datecycle.getDate()).appendTo(topbar);}
            else {var daynum = $('<p>').text(datecycle.getDate() + ' ' + weekday[datecycle.getDay()] ).appendTo(topbar);}
            
            if (dateid in data){ // check if date already in data
                //console.log(dateid + ' already exists.')
            } else { // if not then make new "date"
                data[dateid] = [];
            }

            var tools = $('<div>').addClass('tools').appendTo(topbar);
            var addbtn = $('<div>').appendTo(tools).attr('onclick', 'createNote('+dateid+')');
            $('<ion-icon>').attr('name','add-outline').appendTo(addbtn);
            datecycle.setDate(datecycle.getDate() + 1);
        }
    }


    $('#samplecon').hide();
    refresh();
}

function refresh(){
    
    $('.task').remove();
    // iterating over data to render existing notes
    jQuery.each(data, (i, val) => { // i = dateid, val = object with date tasks
        jQuery.each(val, (j, task) => { // j= taskindex, task = object with task data
            createNote(i, task.val, task.id, task.complete);
        })
    });
    console.log('initialized', data)
    
}


var strokeback2;
var strokeback;
var strokenow;

function createNote(dayselected, val, idnum, complete){
    initsnap = true;
    var id;
    if (idnum != null){id = idnum} // already existing timestamp id
    else { // if this is a new task, create  a new timestamp id
        id = Date.now();
        console.log(data);
        data[dayselected].push({
            id: id,
            val: "",
            type: "task",
            complete: false,
        });
        save();
    };
    
    var task; // finding the 'task' in the data and setting a variable to allow edits
    var index;
    jQuery.each(data, (i, date) => { // iterating to find the task
        jQuery.each(date, (k, datetask)=>{
            if (datetask.id == id){
                task = data[dayselected][k];
                index = k;
            }
        })
    });
    
    var note;
    if( $('#'+dayselected).length ) // checking if the date element exists, or is not on the calendar
    {
        note = $('#sample').clone().addClass('task').appendTo($('#'+dayselected)).attr('id',  id);
    } else { 
        // if the task does not exist
        var head;
        if(! $('.H-'+dayselected).length){
            head = $('<div>').html('<h3>'+dateToNatural(stringToDate(dayselected))+'</h3>').prependTo('#archived').addClass('H-'+dayselected+' datehead');  
        }
        note = $('#sample').clone().addClass('task').appendTo('.H-'+dayselected).attr('id',  id);
        
    }
    
    //******************************************************* */ field editor
    var field = (note.find('p')).focus().html(val);
    field.keypress((e)=>{ // if user types in task
        strokenow = String.fromCharCode(e.keyCode);
        // console.log(strokenow, strokeback, strokeback2);
        if (strokenow == ' ' && strokeback == 'r' && strokeback2 == '/') {
            e.preventDefault();
            window.getSelection().modify("extend", "backward", "character");
            window.getSelection().deleteFromDocument();
            (note.find('p')).css('background-color','#ff7a7a');
        }
        if (e.shiftKey && e.keyCode == 13){ //******************** another new Task
            e.preventDefault();
            createNote(dayselected);
        }

        strokeback2 = strokeback;
        strokeback = strokenow;
    });
    field.keydown((e)=>{
        if (e.keyCode == 46 || e.keyCode == 8){ //******************** deleting a task
            if (field.text()==''){
                e.preventDefault();  
                note.remove();
                data[dayselected].splice(index, 1);
                save();
            }
        }
    });
    field.keyup(e=>{
        task.val = field.html();
        save();
    })

    //******************************************************* */ checkbox
    var checkbox = (note.find('input'));
    if (complete){checkbox.attr('checked','checked');}
    checkbox.click(()=>{
        if(checkbox.prop('checked')) {
            task.complete = true;
        } else {
            task.complete = false;
        };
        save();
    });
}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('');
}

function parseDate(datestring){
    var utc = new Date(datestring).toUTCString();
    return utc;
}

function stringToDate(formatted){ // input: YYYYMMDD  ouput: year
    var dateString  = formatted;
    var year        = dateString.substring(0,4);
    var month       = dateString.substring(4,6);
    var day         = dateString.substring(6,8);

    return new Date(year, month-1, day);
}

function dateToNatural(date){ // input: Date Obj   output: April 4
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[date.getMonth()] + ' ' + date.getDate();
}







