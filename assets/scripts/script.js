var config = {
    apiKey: "AIzaSyAptp0lxGeq1hLjLq5BuHVPJjH4ps3pqt0",
    authDomain: "traintime-d1d8c.firebaseapp.com",
    databaseURL: "https://traintime-d1d8c.firebaseio.com",
    projectId: "traintime-d1d8c",
    storageBucket: "",
    messagingSenderId: "931401348591"
};
firebase.initializeApp(config);

// var trains = [
//     {name: 'Santa Fe', destination: 'Phoenix Arizona', frequency: 60, next: null, minutesAway: null},
//     {name: 'Benjamin Britten', destination: 'Liverpool', frequency: 80, next: null, minutesAway: null},
//     {name: 'Danube Express', destination: 'Budapest', frequency: 30, next: null, minutesAway: null},
//     {name: 'Allersberg Express', destination: 'Allersburg', frequency: 20, next: null, minutesAway: null},
//     {name: 'Sibirjak', destination: 'Berlin', frequency: 10, next: null, minutesAway: null},
//     {name: 'Polar Express', destination: 'North Pole', frequency: 100, next: null, minutesAway: null},
//     {name: 'Rheingold Express', destination: 'Amsterdam', frequency: 50, next: null, minutesAway: null},
//     {name: 'Vindobona', destination: 'Hamburg', frequency: 15, next: null, minutesAway: null},
//     {name: 'Bernina Express', destination: ' St. Moritz', frequency: 17, next: null, minutesAway: null},
//     {name: 'Gottardo', destination: 'Milan', frequency: 120, next: null, minutesAway: null}
// ];

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

    $('#train-list-table tbody').append(trainRowHtml)
});

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
                <td>${trainsDb.trains[key].next}</td>
                <td>${trainsDb.trains[key].minutesAway}</td>
            </tr>`;
        }    
        $('#train-list-table tbody').append(html);
    });
}

init();