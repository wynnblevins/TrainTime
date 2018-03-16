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

function init() {
    // load data from db, put in trains array
    firebase.database().ref().once('value').then(function (snapshot) {
        var trainsDb = snapshot.val();
        trainsCount = trainsDb.trains.length;

        // build table
        var html = '';
        for(var key in trainsDb.trains) {
            html += `<tr>
                <td>${trainsDb.trains[key].name}</td>
                <td>${trainsDb.trains[key].destination}</td>
                <td>${trainsDb.trains[key].frequency}</td>
                <td>${trainsDb.trains[key].next}</td>
                <td>${trainsDb.trains[key].minutesAway}</td>
            </tr>`;
        }    
        $('#train-list-table tbody').append(html);
    });
}

init();