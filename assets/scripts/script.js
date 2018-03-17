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

function onOneMinutePass() {
    console.log('One minute has passed.');
    calculateTimeRemaining();
}

function onTenSecondsPass() {
    console.log('Ten seconds have passed.');
}

$("#add-train-button").click(function () {
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTrainTime = $('#firstTrainTime').val();  // needs to be military time per instructions
    var frequency = $('#frequency').val();
    var dummyVal = '';
    
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

function getMinutesAway() {

}

function init() {
    // load data from db, put in trains array
    firebase.database().ref().once('value').then(function (snapshot) {
        var trainsDb = snapshot.val();

        // build table
        var html = '';
        for(var key in trainsDb.trains) {
            html += `<tr>
                <td>${trainsDb.trains[key].name}</td>
                <td>${trainsDb.trains[key].destination}</td>
                <td>${trainsDb.trains[key].frequency}</td>
                <td>${getNextArrival(trainsDb.trains[key].frequency)}</td>
                <td>${getMinutesAway(trainsDb.trains[key].minutesAway)}</td>
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