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
    console.log(firstTime);
    console.log("firstTime: " + firstTime);
    console.log("tFrequency: " + firstTime.frequency);

    var firstTimeConverted = moment(firstTime.lastArrival, "HH:mm").subtract(1, "years");
    console.log("Converted: " + firstTimeConverted);

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % firstTime.frequency;
    console.log(tRemainder);

    var tMinutesTillTrain = firstTime.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    return tMinutesTillTrain;
}

function onOneMinutePass() {
    console.log('One minute has passed.');
    updateTrainRecord();
}

function onTenSecondsPass() {
    console.log('Ten seconds have passed.');
}

$("#add-train-button").click(function () {
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTrainTime = moment($('#firstTrainTime').val()).format('HH:mm a'); // needs to be military time per instructions
    console.log(firstTrainTime);
    var frequency = $('#frequency').val();
    
    var trainRowHtml = `<tr>
        <td>${trainName}</td>
        <td>${destination}</td>
        <td>${frequency}</td>
        <td>${firstTrainTime}</td>
        <td>${dummyVal}</td>
    </tr>`;

    var newIndex = trainsCount + 1;
    firebase.database().ref('trains/' + newIndex).set({
        name: trainName,
        destination: destination,
        frequency: frequency,
        next: firstTrainTime
    });

    $('#train-list-table tbody').append(trainRowHtml);
});

function getNextArrival(frequency) {
    var nextArrival = moment().add(frequency, 'minutes');
    return moment(nextArrival).format(' h:mm a'); 
}

function updateTrainRecord(trainObj, trainNdx) {
    // set database record for train's arrival time to 
    // value returned from getNextArrival
    trainObj.lastArrival = moment().format('h:mm a');
    trainObj.getNextArrival(trainObj.frequency);

    firebase.database().ref('trains/' + trainNdx);
}

function init() {
    // load data from db, put in trains array
    firebase.database().ref().once('value').then(function (snapshot) {
        var trainsDb = snapshot.val();

        // build table
        var html = '';
        for(var key in trainsDb.trains) {
            console.log(trainsDb.trains[key]);
            
            var remainingMinutes = getMinutesAway(trainsDb.trains[key]);
            
            var nextArrival = getNextArrival(trainsDb.trains[key].frequency);
            console.log(nextArrival);
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

    setInterval(function () {
        onTenSecondsPass();
    }, 10 * 1000);

    setInterval(function () {
        onOneMinutePass();
    }, 60 * 1000);
}

init();