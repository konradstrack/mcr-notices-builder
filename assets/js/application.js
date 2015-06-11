(function() {
	var app = angular.module('noticeListBuilder', []);

	app.controller('NoticeListController', ['$scope', 'noticeListService',
		function($scope, noticeListService, previewService) {
			$scope.notices = noticeListService.notices;

			$scope.settingsModel = {
				cleanUpFormatting: true
			};

			$scope.addNotice = function() {
				noticeListService.addNotice();
			};

			$scope.clearNotices = function() {
				noticeListService.clearNotices();
			};

			$scope.selectPreview = function() {
				var previewContent = document.getElementById('preview-content');

				if (window.getSelection) {
					var range = document.createRange();
					range.selectNodeContents(previewContent);
					window.getSelection().removeAllRanges();
					window.getSelection().addRange(range);
				} else if (document.selection) {
					var range = document.body.createTextRange();
					range.moveToElementText(previewContent);
					range.select();
				}
			};

			$scope.$watch('notices', function(oldVal, newVal) {
				noticeListService.saveNotices();
			}, true);
		}
	]);

	app.factory('noticeListService', ['$window',
		function($window) {
			var notices = $window.JSON.parse($window.localStorage.getItem('notices')) || [];

			return {
				notices: notices,

				addNotice: function() {
					notices.push({
						title: "",
						body: ""
					});
				},

				saveNotices: function() {
					$window.localStorage.setItem('notices', $window.JSON.stringify(notices));
				},

				clearNotices: function() {
					if ($window.confirm('Do you really want to remove all notices?')) {
						notices.length = 0;
					}
				}
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

	app.filter('cleanUpFormatting', ['$sce',
		function($sce) {
			return function(val, settings) {
				var cleanUp = function(element) {
					var nodes = element.childNodes;
					for (var i = 0; i < nodes.length; ++i) {
						fixNodeStyle(nodes[i]);
						cleanUp(nodes[i]);
					}

					return element;
				};

				var fixNodeStyle = function(node) {
					// clean up
					if (node.nodeName.toLowerCase() == 'font') {
						node.removeAttribute("face");
						node.removeAttribute("size");
					}

					var classes = ['span', 'p', 'div', 'code', 'pre', 'a', 'font', 'h1', 'h2', 'h3'];

					if (classes.indexOf(node.nodeName.toLowerCase()) > -1) {
						node.style.fontSize = '';
						node.style.fontFamily = '';
						node.style.lineHeight = '';
					}

					if (node.nodeName.toLowerCase() == 'p') {
						node.style.paddingBottom = '5pt';
					}
				};

				if (settings.cleanUpFormatting) {
					var container = document.createElement('div');
					container.innerHTML = val;
					return cleanUp(container).innerHTML;
				} else {
					return val;
				}
			}
		}
	]);
})();
