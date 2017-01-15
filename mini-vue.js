
var $ = function(str) {
	var type = /^#/.test(str) ? 'id' : '';
	
	switch(type) {
		case 'id':
			return document.querySelector(str);
		default:
			return document.querySelectorAll(str);
	}
}


// var obj = {};
// Object.defineProperty(obj, 'hello', {
// 	set: function(newVal) {
// 		console.log(newVal)
// 		$('#a').value = newVal;
// 		// $('#b').innerHTML = newVal;
// 	}
// });

// document.addEventListener('keyup', function(e) {
// 	obj.hello = e.target.value || '';
// });




function compile(node, vm) {
	var reg = /\{\{(.*)\}\}/;
console.log(node, node.nodeType)
	switch(node.nodeType) {
		case 1:
			var attr = node.attributes,
				len  = attr.length,
				i = 0;
console.log(attr)
			for (; i < len; i++) {
				if (attr[i].nodeName === 'v-model') {
					var name = attr[i].nodeValue;
					node.value = vm.data[name];
					node.removeAttribute('v-model');
				}
			}
			break;
		case 3:
			if (reg.test(node.nodeValue)) {
				var name = RegExp.$1;
				name = name.trim();
				node.nodeValue = vm.data[name];
			}
			break;
		default:
			break;
	}
}

function toFragment(node, vm) {
	var frag = document.createDocumentFragment();
	var child;

	while(child = node.firstChild) {
		compile(child, vm)
		frag.append(child);
		// console.log(frag)
	}
	return frag;
}

function Vue(options) {
	this.data = options.data;
	var id = options.el;
	var dom = toFragment($(id), this);
	$(id).appendChild(dom);
}

var vm = new Vue({
	el: '#app',
	data: {
		text: 'helsssslo world'
	}
})





