//===========Fetch=========
$(function() {
  var apiUrl;
if (document.getElementById("senators-data")){
  apiUrl = "https://api.propublica.org/congress/v1/113/senate/members.json"
  getData(apiUrl);
} else if (document.getElementById("congressmen-data")){
  apiUrl = "https://api.propublica.org/congress/v1/113/house/members.json"
  getData(apiUrl);
}

function getData(url){
  fetch(url,{
    method: 'GET',
    headers: new Headers({
    "X-API-Key": "1pS4P2QU0p0J3PlmSeM9PmZeMG4tj1Z5DdQKktG4"
  })
  } ).then(function(response){
    return response.json();
  }).then (function(json){
    app.senators = json.results[0].members;
    members = json.results[0].members;
    mainFilter();
    atGlance ();
    hi(statistics.least_loyal, statistics.most_loyal, members, "votes_with_party_pct");
    hi(statistics.most_engaged, statistics.least_engaged, members, "missed_votes_pct");
  }).then(function(){
    rockTable();
  }).catch(function(){
      console.log("Fail")
    
  })
}

});

//==========Statistics JSON============
var statistics = {
  "glance": [
    {
      "id": "Democrats",
      "number_of_rpr": 0,
      "average_votes_with_party": 0,
    },
    {
      "id": "Republicans",
      "number_of_rpr": 0,
      "average_votes_with_party": 0,
    },
    {
      "id": "Independents",
      "number_of_rpr": 0,
      "average_votes_with_party": 0,
    },
    {
      "id": "Total",
      "number_of_rpr": 0,
      "average_votes_with_party": 0,
    },
  ],
  "least_engaged": [],
  "most_engaged": [],
  "least_loyal": [],
  "most_loyal": [],
};

var members;

//===================Vue=======================

 var app = new Vue({
    el: "#app",
    data: {
      senators: [],
      headers: ["Name", "Party", "State", "Years in Office", "% Votes w/ Party"],
      statistics: statistics,
    },
    methods:{
      states: function (arr){
        var allStates = [];
        arr.map(function(x){
          allStates.push(x.state)
        });
        var ordered = allStates.sort();
        var newStatesList = [];
        for (i=0; i<ordered.length; i++){
          if (i == ordered.indexOf(ordered[i])){
            newStatesList.push(ordered[i]);
          }
        }
      return newStatesList;
     },
    }
  })




//=========Filters===========

function mainFilter(){
  $("#row-counter").html("Row counter");

     function filter() {
          var checked = Array.from(document.querySelectorAll("input:checked")).map( ele => ele.value);
          var state = $("#states-filter").val();
          var states = state ? [ state ] : [];

          $("#data-body tr").each(function () {
            var party = $(this).find(".party").text();
            var state = $(this).find(".state").text();
            var stateSelected = isIncluded(state, states, party, checked);
            $(this).toggle(stateSelected);
          });
        }

        // x is included if lst is empty or contains x
        function isIncluded(x, lst, p, c) {
          return c.indexOf(p) != -1 && lst.length === 0 || c.indexOf(p) != -1 && lst.indexOf(x) != -1;
        }


        

        $("#filter-form").change(filter);
        $("input[type=checkbox]").change(filter);
}
     



//=====Attendance & Loyalty ========


//at Glance

function atGlance(){
  var dArray = [];
  var rArray = [];
  var iArray = [];
  var dSum = 0;
  var rSum = 0;
  var iSum = 0;
  for ( i in members){
    if (members[i].party == "D"){
      dArray.push($(this));
      statistics.glance[0].number_of_rpr = dArray.length;
      dSum += members[i].votes_with_party_pct;
      statistics.glance[0].average_votes_with_party = Math.floor(dSum / dArray.length * 100) / 100;
    } else if (members[i].party == "R"){
      rArray.push($(this));
      statistics.glance[1].number_of_rpr = rArray.length;
      rSum += members[i].votes_with_party_pct;
      statistics.glance[1].average_votes_with_party = Math.floor(rSum / rArray.length * 100) / 100;
    } else if (members[i].party == "I"){
      iArray.push($(this));
      statistics.glance[2].number_of_rpr = iArray.length;
      iSum += members[i].votes_with_party_pct;
      statistics.glance[2].average_votes_with_party = Math.floor(iSum / iArray.length * 100) / 100;
    } 
  }
  statistics.glance[3].number_of_rpr = dArray.length + rArray.length + iArray.length;
  var AvSum = 0
  for (i in members){
    AvSum += members[i].votes_with_party_pct;
  }
  statistics.glance[3].average_votes_with_party = Math.floor(AvSum / statistics.glance[3].number_of_rpr * 100) / 100;
}


//Loyalty & Attendance

function sortNumber(a,b) {
    return a - b;
}

function hi (key, key2, data, prop){
  var array = [];
  for (i in data){
    array.push(data[i][prop])
  }
  var ordered = array.sort(sortNumber);
  var array2 = [];
  for (i in ordered){
    if (array2.length/data.length * 100 < 10){
      array2.push(ordered[i]);
    }
  }
  var finalArr = [];
  for (i in array2){
    for (j in data){
      if (array2[i] == data[j][prop] && array2.indexOf(array2[i]) == i)
        finalArr.push(data[j]);
    }
  }
  for (i in finalArr){
    key.push({"url": finalArr[i].url, "last_name": finalArr[i].last_name, "first_name": finalArr[i].first_name, "middle_name": finalArr[i].middle_name, "total_votes": finalArr[i].total_votes, "votes_with_party_pct": finalArr[i].votes_with_party_pct, "missed_votes": finalArr[i].missed_votes, "missed_votes_pct": finalArr[i].missed_votes_pct});
  }
  
  var reversed = array.reverse(sortNumber);
  var array3 = [];
  for (i in reversed){
    if (array3.length/data.length * 100 < 10){
      array3.push(reversed[i]);
    }
  }
  var finalArr2 = [];
  for (i in array3){
    for (j in data){
      if (array3[i] == data[j][prop] && array3.indexOf(array3[i]) == i)
        finalArr2.push(data[j]);
    }
  }
  for (i in finalArr2){
    key2.push({"url": finalArr2[i].url, "last_name": finalArr2[i].last_name, "first_name": finalArr2[i].first_name, "middle_name": finalArr2[i].middle_name, "total_votes": finalArr2[i].total_votes, "votes_with_party_pct": finalArr2[i].votes_with_party_pct, "missed_votes": finalArr2[i].missed_votes, "missed_votes_pct": finalArr2[i].missed_votes_pct});
  }
}

//=========ColorBox & DataTable=========


function rockTable(){
  $(".rock").dataTable({
    "bPaginate": false,
    fixedHeader: true,
  });
}


