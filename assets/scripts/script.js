var trains = [];
var $trainListTable = $('#train-list-table > tbody');
var config = {
    apiKey: "AIzaSyAptp0lxGeq1hLjLq5BuHVPJjH4ps3pqt0",
    authDomain: "traintime-d1d8c.firebaseapp.com",
    databaseURL: "https://traintime-d1d8c.firebaseio.com",
    projectId: "traintime-d1d8c",
    storageBucket: "",
    messagingSenderId: "931401348591"
};
firebase.initializeApp(config);

function calculateNextArrival(tMinutesTillTrain) {
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return nextTrain;
}

function calculateMinutesUntilTrain(firstArrivalTime, tFrequency) {
    // get first arrival time from moment 
    var firstTimeConverted = moment(firstArrivalTime, "HH:mm").subtract(1, "years");
    
    // calculate difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // calculate time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // calculate minutes until train
    var tMinutesTillTrain = tFrequency - tRemainder;

    return tMinutesTillTrain;
}

$("#add-train-button").click(function () {

});

function init() {
    firebase.database().ref().once('value').then(function (snapshot) {
        // html variable that will represent our trains table, will be appended to screen
        var html = '';
        
        // put retrieved trains inside of trains variable 
        trains = snapshot.val().trains;

        // build the trains table with data from trains array
        for (var i = 0; i < trains.length; i++) {
            // put frequency value from database in variable to help with readability
            var trainFrequency = trains[i].frequency;

            // use frequency on load because we are use in relative times (per instrutions)
            var nextArrival = calculateNextArrival(trainFrequency);
            
            // calculate minutes away for each train
            var minutesAway = calculateMinutesUntilTrain(nextArrival, trainFrequency)

            var trainListRow = `<tr>
                <td>${trains[i].name}</td>
                <td>${trains[i].destination}</td>
                <td>${trainFrequency}</td>
                <td>${moment(nextArrival).format('h:mm a')}</td>
                <td>${minutesAway}</td>
                <td><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></td>
            </tr>`;

            html += trainListRow;
        }

        $trainListTable.append(html);
    });
}

init();