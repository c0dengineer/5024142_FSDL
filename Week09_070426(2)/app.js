angular.module('libraryApp', [])

.controller('MainCtrl', function($scope){

  $scope.books = [];
  $scope.newBook = {};
  $scope.filter = "all";

  $scope.stats = { total:0, overdue:0, onTime:0 };

  // LIVE STATS
  $scope.$watch('books', function(){
    $scope.stats.total = $scope.books.length;

    $scope.stats.overdue = $scope.books.filter(b =>
      new Date(b.dueDate) < new Date()
    ).length;

    $scope.stats.onTime = $scope.books.filter(b =>
      new Date(b.dueDate) >= new Date()
    ).length;

  }, true);

  // DATE VALIDATION
  $scope.$watchGroup(['newBook.borrowDate','newBook.dueDate'], function(){
    if($scope.newBook.borrowDate && $scope.newBook.dueDate){
      $scope.dateError =
        new Date($scope.newBook.dueDate) <= new Date($scope.newBook.borrowDate);
    }
  });

  // ADD
  $scope.addBook = function(){
    if($scope.dateError) return;

    $scope.books.unshift(angular.copy($scope.newBook));

    $scope.newBook = {};
    $scope.bookForm.$setPristine();
    $scope.bookForm.$setUntouched();
  };

  // STATUS
  $scope.status = function(b){
    return new Date(b.dueDate) < new Date() ? "Overdue" : "On Time";
  };

  $scope.statusClass = function(b){
    return new Date(b.dueDate) < new Date() ? "overdue" : "ok";
  };

  // FILTER
  $scope.filterBooks = function(b){
    if($scope.filter === "all") return true;
    if($scope.filter === "overdue") return new Date(b.dueDate) < new Date();
    if($scope.filter === "ok") return new Date(b.dueDate) >= new Date();
  };

});