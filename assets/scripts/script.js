$(document).ready(function () {
    var $frequency = $('#frequency');
    var $firstTrainTime = $('#firstTrainTime');
    var $destination = $('#destination');
    var $trainName = $('#trainName');

    var $trainListTable = $('#train-list-table > tbody');
    var trains = [];
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

    function buildTrainsTable(trains) {
        var html = '';

        // build the trains table with data from trains array
        for (var train in trains) {
            // put frequency value from database in variable to help with readability
            var trainFrequency = trains[train].frequency;

            // use frequency on load because we are use in relative times (per instrutions)
            var nextArrival = calculateNextArrival(trainFrequency);
            
            // calculate minutes away for each train
            var minutesAway = calculateMinutesUntilTrain(nextArrival, trainFrequency)

            // build row
            var trainListRow = `<tr>
                <td>${trains[train].name}</td>
                <td>${trains[train].destination}</td>
                <td>${trainFrequency}</td>
                <td>${moment(nextArrival).format('h:mm a')}</td>
                <td>${minutesAway}</td>
                <td><button type="button" class="btn btn-danger delete-train-button"><span class="glyphicon glyphicon-trash"></span></td>
            </tr>`;

            html += trainListRow;
        }    

        return html;
    }

    function init() {
        firebase.database().ref().once('value').then(function (snapshot) {
            // put retrieved trains inside of trains variable 
            if (snapshot.val()) {
                trains = snapshot.val().trains;
            }

            var html = buildTrainsTable(trains);

            // append newly built html to screen
            $trainListTable.append(html);

            $trainListTable.empty();
            var html = buildTrainsTable(trains);
            $trainListTable.append(html);
        });
    }

    // add button click handler
    $("#add-train-button").click(function () {
        // get text field values
        var frequency = $frequency.val().trim();
        var firstTrainTime = $firstTrainTime.val().trim();
        var destination = $destination.val().trim();
        var trainName = $trainName.val().trim();

        // empty text inputs
        $frequency.val('');
        $firstTrainTime.val('');
        $destination.val('');
        $trainName.val('');        
        
        firebase.database().ref('/trains').push({
            name: trainName,
            destination: destination,
            frequency: parseInt(frequency),
            lastArrival: firstTrainTime,
        });

        // refresh the trains table
        init();
    });

    // delete button click handler
    $(document).on('click', 'button.delete-train-button', function () {
        var clickedIndex = $('button.delete-train-button').index(this);
        var arrayIndex = 0;
        firebase.database().ref('trains').once('value', function (snapshot) {
            
            snapshot.forEach(function (child) {
                if (clickedIndex === arrayIndex) {
                    firebase.database().ref('/trains').child(child.key).remove();
                    arrayIndex++;
                }
                else {
                    arrayIndex++;
                }
            });

            init();
        });        
    });

    init();
});