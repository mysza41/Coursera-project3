(function () {
'use strict';
angular.module('NarrowItDownApp', [])

.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {

  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    });
    return response

    .then(function (response) {
      var result = response.data.menu_items;
      var foundItems = [];
      for (var i = 0; i < result.length; i ++) {
        var elem = {
          name: result[i].name,
          short_name: result[i].short_name,
          description: result[i].description
        };
        if(elem.name.toLowerCase().indexOf(searchTerm) !== -1) {
          foundItems.push(elem);
        }
      }
      return foundItems;
    });
  };
}

NarrowItDownController.$inject = ['MenuSearchService', '$q'];

function NarrowItDownController(MenuSearchService, $q) {

  var controller = this;

  controller.findMenuItems = function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    var check = checkTextbox(searchTerm);

    $q.all([promise, check]).

    then(function (result) {
      controller.found = result[0];
    })
    .catch(function (error) {
      controller.found = [];
      console.log("Something went wrong");
    });
  };

  controller.removeItem = function (itemIndex) {
    controller.found.splice(itemIndex, 1);
  };

  function checkTextbox(searchTerm) {
    var deferred = $q.defer();
    if (searchTerm) {
      deferred.resolve();
    }
    else {
      deferred.reject();
    }
    return deferred.promise;
  }

}


})();
