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
    console.log('Hello, World!');
});

function init() {
    var trains = [
        {name: 'Santa Fe', destination: 'Phoenix Arizona', frequency: 60, next: null, minutesAway: null},
        {name: 'Benjamin Britten', destination: 'Liverpool', frequency: 80, next: null, minutesAway: null},
        {name: 'Danube Express', destination: 'Budapest', frequency: 30, next: null, minutesAway: null},
        {name: 'Allersberg Express', destination: 'Allersburg', frequency: 20, next: null, minutesAway: null},
        {name: 'Sibirjak', destination: 'Berlin', frequency: 10, next: null, minutesAway: null},
        {name: 'Polar Express', destination: 'North Pole', frequency: 100, next: null, minutesAway: null},
        {name: 'Rheingold Express', destination: 'Amsterdam', frequency: 50, next: null, minutesAway: null},
        {name: 'Vindobona', destination: 'Hamburg', frequency: 15, next: null, minutesAway: null},
        {name: 'Bernina Express', destination: ' St. Moritz', frequency: 17, next: null, minutesAway: null},
        {name: 'Gottardo', destination: 'Milan', frequency: 120, next: null, minutesAway: null}
    ];

    var html = '';
    for(var i = 0; i < trains.length; i++) {
        html += `<tr>
            <td>${trains[i].name}</td>
            <td>${trains[i].destination}</td>
            <td>${trains[i].frequency}</td>
            <td>${trains[i].next}</td>
            <td>${trains[i].minutesAway}</td>
        </tr>`;
    }    
    $('#train-list-table tbody').append(html);
}

init();