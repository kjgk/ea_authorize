String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.trimLeft = function() {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.trimRight = function() {
    return this.replace(/(\s*$)/g, "");
}
String.prototype.isEmpty = function() {
    return this.trim().length == 0;
}
String.prototype.trimRightString = function(str) {
    var s = this.trim();
    var i = s.lastIndexOf(str);
    if(i < 0){
        return s;
    }
    s = s.substring(0,i);
    return s;
}

function getUuid(){
    var s = [];
    var itoh = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    // Make array of random hex digits. The UUID only has 32 digits in it, but we
    // allocate an extra items to make room for the '-'s we'll be inserting.
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random()*0x10);

    // Conform to RFC-4122, section 4.4
    s[14] = 4;  // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

    // Convert to hex chars
    for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join('');
}
function convertToHtml(html){
    html = html.replace("&","&amp;");
    html = html.replace("<","&lt;");
    html = html.replace(">","&gt;");
    html = html.replace('"',"&quot;");
    html = html.replace("©","&copy;");
    html = html.replace("®","&reg;");
    html = html.replace("™","™");
    html = html.replace(" ", "&nbsp;");
    html = html.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    html = html.replace("\r\n", "<br>");
   return html;
}

String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}
String.prototype.startWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}

