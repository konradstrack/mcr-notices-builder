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
    }
    
    if (node.nodeName.toLowerCase() == 'p') {
        node.style.paddingBottom = '5pt';
    }
}

function addNotice() {
    var notices = document.getElementById("notices");
    
    var notice = document.createElement("article");
    notice.contentEditable = "true";
    notice.className = "notice";
    
    notices.appendChild(notice);
}

function generate() {
    var resultElement = document.getElementById("result");
    var previewElement = document.getElementById("preview");
    var notices = document.getElementsByClassName("notice");
    
    previewElement.innerHTML = '';
    
    var table = document.createElement("table");
    previewElement.appendChild(table);
    
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
        
        tdIndex.textContent = index;
        ++index;
        
        var tdContent = document.createElement("td");
        tdContent.style.paddingBottom = '20pt';
        tdContent.style.borderTop = '1px solid #777777';
        tdContent.innerHTML = notice.innerHTML;
        
        tr.appendChild(tdIndex);
        tr.appendChild(tdContent);
        
        table.appendChild(tr);
    });
    
    resultElement.textContent = previewElement.innerHTML;
}
