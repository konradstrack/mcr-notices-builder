function cleanUp() {
    var notices = document.getElementsByClassName("notice");
    
    Array.prototype.forEach.call(notices, function(notice) {     
        cleanChildNodes(notice);
    });
}

function cleanChildNodes(element) {
    var nodes = element.childNodes;
    for(var i = 0; i < nodes.length; ++i) {
        fixNodeStyle(nodes[i]);
        cleanChildNodes(nodes[i]);
    }
}
    
function fixNodeStyle(node) {  
    // clean up
    if (node.nodeName.toLowerCase() == 'font') {
        node.removeAttribute("face");
    }
    
    var classes = ['span', 'p', 'div', 'code', 'pre', 'a'];
    
    if (classes.indexOf(node.nodeName.toLowerCase()) > -1) {
        node.style.fontSize = '';
        node.style.fontFamily = '';
		node.style.lineHeight = '';
    }
    
    if (node.nodeName.toLowerCase() == 'p') {
        node.style.paddingBottom = '5pt';
    }
}

function addNotice(htmlValue) {
    var notices = document.getElementById("notices");
    
    var notice = document.createElement("article");
    notice.contentEditable = "true";
    notice.className = "notice";
	notice.onkeyup = function() {
		saveNotices();
		generate();
	};

	if (typeof(htmlValue) === 'undefined') htmlValue = '';
	notice.innerHTML = htmlValue;
    
    notices.appendChild(notice);
	return notice;
}

function generate() {
    var resultElement = document.getElementById("result");
    var previewElement = document.getElementById("preview");
    var notices = JSON.parse(localStorage.getItem('notices'));;
    
    previewElement.innerHTML = '';
    
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
	if (storedNotices !== null) {
		console.log(storedNotices);

		Array.prototype.forEach.call(storedNotices, function(notice) {
			addNotice(notice);
		});
	}
}

function saveNotices() {
	var notices = document.getElementsByClassName('notice');
	var noticesToStore = [];

    Array.prototype.forEach.call(notices, function(notice) {
		noticesToStore.push(notice.innerHTML);
	});

	localStorage.setItem('notices', JSON.stringify(noticesToStore));
}

function clearNotices() {
	localStorage.removeItem('notices');
}

