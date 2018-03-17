var trainsCount = null;
var config = {
    apiKey: "AIzaSyAptp0lxGeq1hLjLq5BuHVPJjH4ps3pqt0",
    authDomain: "traintime-d1d8c.firebaseapp.com",
    databaseURL: "https://traintime-d1d8c.firebaseio.com",
    projectId: "traintime-d1d8c",
    storageBucket: "",
    messagingSenderId: "931401348591"
};
firebase.initializeApp(config);

function getMinutesAway(firstTime) {
    var firstTimeConverted = moment(firstTime.lastArrival, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % firstTime.frequency;
    var tMinutesTillTrain = firstTime.frequency - tRemainder;
    return tMinutesTillTrain;
}

function onOneMinutePass(trainObj, trainNdx) {
    updateTrainRecord(trainObj, trainNdx);
}

function onTrainArrival(trainObj, trainNdx) {
    var minutesAway = getMinutesAway(trainObj);
}

$("#add-train-button").click(function () {
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTrainTime = moment('HH:mm').format('HH:mm');
    var frequency = $('#frequency').val();
    
    // initially frequency will be same as minutes
    var trainRowHtml = `<tr>
        <td>${trainName}</td>
        <td>${destination}</td>
        <td>${frequency}</td>
        <td>${firstTrainTime}</td>
        <td>${frequency}</td>  
    </tr>`;

    firebase.database().ref('trains/' + trainsCount).set({
        name: trainName,
        destination: destination,
        frequency: parseInt(frequency),
        lastArrival: firstTrainTime,
    });

    $('#train-list-table tbody').append(trainRowHtml);
});

function getNextArrival(frequency) {
    var nextArrival = moment().add(frequency, 'minutes');
    return moment(nextArrival).format('h:mm a'); 
}

function updateTrainRecord(trainObj, trainNdx) {
    firebase.database().ref('trains/' + trainNdx);

    var $tableRows = $('#train-list-table > tbody > tr');
    for (var i = 0; i < $tableRows.length; i++) {
        var $td = $('#train-list-table > tbody > tr').eq(i).find('td').eq(4);
        var currValue = parseInt($td.text()) - 1;

        // if train hasnt arrived
        if (currValue > 0) {
            $td.text(currValue);
        } else {  // else train has arrived
            var $frequencyCell = $('#train-list-table > tbody > tr').eq(i).find('td').eq(2);
            $td.text($frequencyCell.text());
        } 
    }
}
var remainingMinutes = null;
function init() {
    // load data from db, put in trains array
    firebase.database().ref().once('value').then(function (snapshot) {
        var trainsDb = snapshot.val();
        trainsCount = trainsDb.trains.length;

        setInterval(function () {
            onOneMinutePass(trainsDb.trains, key);
        }, 60 * 1000);

        // build table
        var html = '';
        for(var key in trainsDb.trains) {        
            

            remainingMinutes = getMinutesAway(trainsDb.trains[key]);
            if (remainingMinutes === 0) {
                updateTrainRecord(trainsDb.trains[key], key);
            }
            var nextArrival = getNextArrival(trainsDb.trains[key].frequency);

            html += `<tr>
                <td>${trainsDb.trains[key].name}</td>
                <td>${trainsDb.trains[key].destination}</td>
                <td>${trainsDb.trains[key].frequency}</td>
                <td>${getNextArrival(trainsDb.trains[key].frequency)}</td>
                <td>${remainingMinutes}</td>
            </tr>`;
        }    
        $('#train-list-table tbody').append(html);
    });
}

init();