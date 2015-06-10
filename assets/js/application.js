(function() {
	var app = angular.module('noticeListBuilder', []);

	app.controller('NoticeListController', ['$scope', '$sce', 'noticeListService', 'previewService',
		function($scope, $sce, noticeListService, previewService) {
			$scope.notices = noticeListService.notices;
			$scope.previewHTML = previewService.updatePreview($scope.notices);

			$scope.addNotice = function() {
				noticeListService.addNotice();
			};

			$scope.updatePreview = function() {
				$scope.previewHTML = previewService.updatePreview($scope.notices);
			};
		}
	]);

	app.factory('noticeListService', function() {
		var notices = [{
			title: "First.",
			body: "Some text."
		}, {
			title: "Second.",
			body: "More text."
		}];

		var addNotice = function() {
			notices.push({
				title: "More.",
				body: "Even more."
			});
		};

		return {
			notices: notices,
			addNotice: addNotice
		};
	});

	app.factory('previewService', ['$sce',
		function($sce) {

			var updatePreview = function(notices) {
				var preview = document.createElement('div');
				preview.innerHTML = '';

				var index = 1;
				Array.prototype.forEach.call(notices, function(notice) {
					var span = document.createElement('span');
					span.innerHTML = index + '. ' + notice.title;
					++index;

					preview.appendChild(span);
					preview.appendChild(document.createElement('br'));
				});

				return $sce.trustAsHtml(preview.innerHTML);
			}

			return {
				updatePreview: updatePreview
			}
		}
	]);

	app.directive('noticeEditor', function() {
		return {
			templateUrl: 'assets/templates/noticeEditor.html'
		}
	});

	// based directly on https://fdietz.github.io/recipes-with-angular-js
	app.directive("contenteditable", function() {
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
	});
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

function addNotice(titleHtml, noticeHtml) {
	if (typeof(noticeHtml) === 'undefined') noticeHtml = '';
	if (typeof(titleHtml) === 'undefined') titleHtml = '';

	var notices = document.getElementById("notices");

	var notice = document.createElement("article");
	notice.contentEditable = "true";
	notice.className = "notice";

	var title = document.createElement("p");
	title.contentEditable = "true";
	title.className = "notice-title";

	var updateFunction = function() {
		saveNotices();
		generate();
	};

	notice.onkeyup = updateFunction;
	title.onkeyup = updateFunction;

	notice.innerHTML = noticeHtml;
	title.innerHTML = titleHtml;

	notices.appendChild(title);
	notices.appendChild(notice);
	return notice;
}

function generate() {
	var resultElement = document.getElementById("result");
	var previewElement = document.getElementById("preview");
	var notices = JSON.parse(localStorage.getItem('notices'));
	var titles = JSON.parse(localStorage.getItem('titles'));

	previewElement.innerHTML = '';

	if (titles !== null) {
		var index = 1;
		Array.prototype.forEach.call(titles, function(title) {
			var span = document.createElement('span');
			span.innerHTML = index + '. ' + title;
			++index;

			previewElement.appendChild(span);
			previewElement.appendChild(document.createElement('br'));
		});

		previewElement.appendChild(document.createElement('br'));
	}

	var table = document.createElement("table");
	table.style.width = '100%';
	previewElement.appendChild(table);

	if (notices !== null) {
		var index = 1;
		Array.prototype.forEach.call(notices, function(notice) {
			var tr = document.createElement("tr");

			var tdIndex = document.createElement("td");
			tdIndex.style.paddingRight = '20pt';
			tdIndex.style.borderTop = '1px solid #777777';
			tdIndex.style.verticalAlign = 'top';
			tdIndex.style.fontSize = '20pt';
			tdIndex.style.color = '#444444';
			tdIndex.style.fontWeight = 'bold';
			tdIndex.style.width = '40pt';

			tdIndex.textContent = index;
			++index;

			var tdContent = document.createElement("td");
			tdContent.style.paddingBottom = '20pt';
			tdContent.style.borderTop = '1px solid #777777';
			tdContent.innerHTML = notice;

			tr.appendChild(tdIndex);
			tr.appendChild(tdContent);

			table.appendChild(tr);
		});
	}

	resultElement.textContent = previewElement.innerHTML;
}

function readNotices() {
	var noticesContainer = document.getElementById('notices');
	noticesContainer.innerHTML = '';

	var storedNotices = JSON.parse(localStorage.getItem('notices'));
	var storedTitles = JSON.parse(localStorage.getItem('titles'));
	if (storedNotices !== null && storedTitles !== null) {
		console.log(storedNotices);
		console.log(storedTitles);

		var numberOfNotices = storedNotices.length;

		for (var i = 0; i < numberOfNotices; ++i) {
			addNotice(storedTitles[i], storedNotices[i]);
		}
	}
}

function saveNotices() {
	var notices = document.getElementsByClassName('notice');
	var noticesToStore = [];

	Array.prototype.forEach.call(notices, function(notice) {
		noticesToStore.push(notice.innerHTML);
	});


	var titles = document.getElementsByClassName('notice-title');
	var titlesToStore = [];

	Array.prototype.forEach.call(titles, function(title) {
		titlesToStore.push(title.innerHTML);
	});

	localStorage.setItem('notices', JSON.stringify(noticesToStore));
	localStorage.setItem('titles', JSON.stringify(titlesToStore));
}

function clearNotices() {
	localStorage.removeItem('notices');
	localStorage.removeItem('titles');
}
