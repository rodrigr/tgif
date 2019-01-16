var statistics = {
  "number_of_democrats": 0,
  "number_of_republicans": 0,
  "number_of_independents": 0,
  "total": 0,
  "democrats_average_votes_with_party": 0,
  "republicans_average_votes_with_party": 0,
  "independents_average_votes_with_party": 0,
  "total_average": 0,
  "least_engaged": [],
  "most_engaged": [],
  "least_loyal": [],
  "most_loyal": [],
};

//var members = data.results[0].members;
var members = app.senators;


//at Glance function

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
      statistics.number_of_democrats = dArray.length;
      dSum += members[i].votes_with_party_pct;
      statistics.democrats_average_votes_with_party = Math.floor(dSum / dArray.length * 100) / 100;
    } else if (members[i].party == "R"){
      rArray.push($(this));
      statistics.number_of_republicans = rArray.length;
      rSum += members[i].votes_with_party_pct;
      statistics.republicans_average_votes_with_party = Math.floor(rSum / rArray.length * 100) / 100;
    } else if (members[i].party == "I"){
      iArray.push($(this));
      statistics.number_of_independents = iArray.length;
      iSum += members[i].votes_with_party_pct;
      statistics.independents_average_votes_with_party = Math.floor(iSum / iArray.length * 100) / 100;
    } 
  }
  statistics.total = dArray.length + rArray.length + iArray.length;
  var AvSum = 0
  for (i in members){
    AvSum += members[i].votes_with_party_pct;
  }
  statistics.total_average = Math.floor(AvSum / statistics.total * 100) / 100;
}

 atGlance ()


//At Glance Table


function atGlanceTable(){
    return "<tr><td>Democrats</td><td>" + statistics.number_of_democrats + "</td><td>" + statistics.democrats_average_votes_with_party + " % </td></tr><tr><td>Republicans</td><td>" + statistics.number_of_republicans + "</td><td>" + statistics.republicans_average_votes_with_party + " % </td></tr><tr><td>Independents</td><td>" + statistics.number_of_independents + "</td><td>" + statistics.independents_average_votes_with_party + " % </td></tr><tr><td>Total</td><td>" + statistics.total + "</td><td>" + statistics.total_average + " % </td></tr>"
}

$("#at-glance").html(atGlanceTable());

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

hi(statistics.least_loyal, statistics.most_loyal, members, "votes_with_party_pct");
hi(statistics.most_engaged, statistics.least_engaged, members, "missed_votes_pct"); 

//Loyalty & Attendance Tables

var leastLoyalTable = statistics.least_loyal.map(function(x){
  return "<tr><td><a href=\"" + x.url + "\">" + x.last_name + ", " + x.first_name + " " + (x.middle_name || "") + "</a></td><td>" + x.total_votes + "</td><td>" + x.votes_with_party_pct +  " %</td></tr>"
})
$("#least-loyal").html(leastLoyalTable);

var mostLoyalTable = statistics.most_loyal.map(function(x){
  return "<tr><td><a href=\"" + x.url + "\">" + x.last_name + ", " + x.first_name + " " + (x.middle_name || "") + "</a></td><td>" + x.total_votes + "</td><td>" + x.votes_with_party_pct +  " %</td></tr>"
})
$("#most-loyal").html(mostLoyalTable);

var leastEngagedTable = statistics.least_engaged.map(function(x){
  return "<tr><td><a href=\"" + x.url + "\">" + x.last_name + ", " + x.first_name + " " + (x.middle_name || "") + "</a></td><td>" + x.missed_votes + "</td><td>" + x.missed_votes_pct +  " %</td></tr>"
})
$("#least-engaged").html(leastEngagedTable);

var mostEngagedTable = statistics.most_engaged.map(function(x){
  return "<tr><td><a href=\"" + x.url + "\">" + x.last_name + ", " + x.first_name + " " + (x.middle_name || "") + "</a></td><td>" + x.missed_votes + "</td><td>" + x.missed_votes_pct +  " %</td></tr>"
})
$("#most-engaged").html(mostEngagedTable);






