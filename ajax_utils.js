//Shortcut method to get input values
function getValue(id) {
	return document.getElementById(id).value;
}
function setValue(id, val) {
	document.getElementById(id).value = val;
}
/*
 * Create tye most optimal XML HTTP request
 * object for the browser.
 */
function createRequest() {
	var v;

	try {
		v = new XMLHttpRequest(); //Mozilla and IE7
	} catch (e) {
		v = createActivexXMLHttp(); //IE6 and back
	}

	if (v == null)
		throw new Error("XMLHttpRequest not supported");

	return v;
}

function createActivexXMLHttp() {
    var aVersions = [ "MSXML2.XMLHttp.5.0",
        "MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0",
        "MSXML2.XMLHttp","Microsoft.XMLHttp"];

    for (var i = 0; i < aVersions.length; i++) {
        try {
            var oXmlHttp = new ActiveXObject(aVersions[i]);
			
			return oXmlHttp;
        } catch (oError) {
            //Do nothing
        }
    }

    throw new Error("MSXML is not installed.");
}

/*
 * Utility method to allow concurrent GET requests
 */
function ajaxGet(url, onLoad, data) {
	var xhr = createRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				onLoad(xhr, data);
			}
			xhr = null; //Avoid IE memory leak
			data = null;
		}
	}
	xhr.open("GET", url, true);
	xhr.send("");
}

function ajaxPost(url, requestData, onLoad, data) {
	var xhr = createRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				onLoad(xhr, data);
			}
			xhr = null; //Avoid IE memory leak
			data = null;
		}
	}
	var body = "";
	for (var name in requestData) {
		if (body.length > 0) {
			body = body + "&";
		}
		body = body + escape(name) + "=" + escape(requestData[name]);
	}
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded; charset=UTF-8");
	xhr.send(body);
}
/*
 * Converts a DOM document into XML text in a browser
 * neutral fashion.
 */
function getXMLString(doc) {
	var xml = null;
	try {
		//Mozilla
		var ser = new XMLSerializer();
		xml = ser.serializeToString(doc);
	} catch (e) {
		//IE
		xml = doc.xml;
	}
	
	return xml;
}


/*
 * Utility method that posts a DOM document.
 */
function ajaxPostDocument(url, doc, onLoad, data) {
	var xhr = createRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				onLoad(xhr, data);
			}
			xhr = null; //Prevent memory leak in IE
		}
	}
	var xml = getXMLString(doc);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded; charset=UTF-8");
	xhr.send("xml=" + escape(xml));
}
