var app = angular.module("myApp", []);

app.controller("MainController", function($scope) {

    // Load list from localStorage
    $scope.names = JSON.parse(localStorage.getItem("names")) || [];

    $scope.username = "";

    // Add name
    $scope.addName = function() {
        if ($scope.username) {
            $scope.names.push($scope.username);
            localStorage.setItem("names", JSON.stringify($scope.names));
            $scope.username = "";
        }
    };

    // Delete one
    $scope.deleteName = function(index) {
        $scope.names.splice(index, 1);
        localStorage.setItem("names", JSON.stringify($scope.names));
    };

    // Clear all
    $scope.clearAll = function() {
        $scope.names = [];
        localStorage.removeItem("names");
    };

    // Clear input
    $scope.clearInput = function() {
        $scope.username = "";
    };

    // Greeting
    $scope.getGreeting = function() {
        if (!$scope.username) return "Hi Cutie 🍓";

        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning, " + $scope.username + " ☀️";
        if (hour < 18) return "Good Afternoon, " + $scope.username + " 🌤️";
        return "Good Evening, " + $scope.username + " 🌙";
    };
});