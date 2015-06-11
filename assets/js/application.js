(function() {
	var app = angular.module('noticeListBuilder', []);

	app.controller('NoticeListController', ['$scope', 'noticeListService',
		function($scope, noticeListService, previewService) {
			$scope.notices = noticeListService.notices;

			$scope.addNotice = function() {
				noticeListService.addNotice();
			};

			$scope.saveNotices = function() {
				Array.prototype.forEach.call($scope.notices, function(notice) {
					console.log("here", notice.title);
				});
				noticeListService.saveNotices();
			};
		}
	]);

	app.factory('noticeListService', ['$window',
		function($window) {
			var notices = $window.JSON.parse($window.localStorage.getItem('notices')) || [];

			var saveNotices = function() {
				$window.localStorage.setItem('notices', $window.JSON.stringify(notices));
			};

			return {
				notices: notices,

				addNotice: function() {
					notices.push({
						title: "",
						body: ""
					});
				},

				saveNotices: saveNotices
			};
		}
	]);

	app.directive('noticeEditor', function() {
		return {
			templateUrl: 'assets/templates/noticeEditor.html'
		}
	});

	app.directive('preview', function() {
		return {
			templateUrl: 'assets/templates/preview.html'
		}
	});

	// based directly on https://fdietz.github.io/recipes-with-angular-js
	app.directive("contenteditable", ['$sce',
		function($sce) {
			return {
				restrict: "A",
				require: "ngModel",
				link: function(scope, element, attrs, ngModel) {

					function read() {
						ngModel.$setViewValue(element.html());
					}

					ngModel.$render = function() {
						element.html(ngModel.$viewValue || "");
					};

					element.bind("blur keyup change", function() {
						scope.$apply(read);
					});
				}
			};
		}
	]);

	app.filter('trustAsHtml', ['$sce',
		function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		}
	]);
})();


/*******/

function cleanUp() {
	var notices = document.getElementsByClassName("notice");

	Array.prototype.forEach.call(notices, function(notice) {
		cleanChildNodes(notice);
	});

	var titles = document.getElementsByClassName("notice-title");

	Array.prototype.forEach.call(titles, function(title) {
		cleanChildNodes(title);
	});
}

function cleanChildNodes(element) {
	var nodes = element.childNodes;
	for (var i = 0; i < nodes.length; ++i) {
		fixNodeStyle(nodes[i]);
		cleanChildNodes(nodes[i]);
	}
}

function fixNodeStyle(node) {
	// clean up
	if (node.nodeName.toLowerCase() == 'font') {
		node.removeAttribute("face");
		node.removeAttribute("size");
	}

	var classes = ['span', 'p', 'div', 'code', 'pre', 'a', 'font'];

	if (classes.indexOf(node.nodeName.toLowerCase()) > -1) {
		node.style.fontSize = '';
		node.style.fontFamily = '';
		node.style.lineHeight = '';
	}

	if (node.nodeName.toLowerCase() == 'p') {
		node.style.paddingBottom = '5pt';
	}
}

function clearNotices() {
	localStorage.removeItem('notices');
	localStorage.removeItem('titles');
}
