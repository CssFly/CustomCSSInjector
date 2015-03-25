
/*
#
# Small CSS injector for referencing custom Style Sheet Files configured by URL.
#
# Author: Philipp Hennermann 2015
#
# License: M.I.T.
#
# Usage: 1. insert <script src="path/to/CustomCSSInjector.js"></script> before closing </head> tag in your HTML
#        2. external style sheets will be injected here
#        3. you can activate the injection of external CSS by modifing the URL of your page, e.g. by URL-Parameter
#
#           http://www.example.com/?customCSSpath=http://www.otherpage.com/style.css OR by Hash:
#           http://www.example.com/#customCSSpath=http://www.otherpage.com/style.css
#           http://www.example.com/#customCSSpath=http://www.otherpage.com/style_1.css,http://www.otherpage.com/style_2.css
#
#           This will create a localStorage entry that serves the referenced CSS file by magic until you
#           call your page with the parameter "off", e.g. by URL-Parameter
#
#           http://www.example.com/?customCSSpath=off OR by Hash
#           http://www.example.com/#customCSSpath=off
*/

var CustomCSSInjector = function(customCSSpath, keyForLocalStorage)
{
  this.keyForLocalStorage = keyForLocalStorage || 'CustomCSSInjector';
  this.customCSSpath = customCSSpath
        || window.location.hash.split('#customCSSpath=')[1]
        || window.location.href.split('?customCSSpath=')[1];

  this._storeCustomCSSpath();
  this._setCustomCSSPathFromStorage();
  this._removeCustomCSSPathFromStorage();
  this._stripInvalidCSSURLs();
  this._injectCSS();
};

CustomCSSInjector.prototype._injectCSS = function()
{
  if(this._isValidCSSURL(this.customCSSpath))
  {
    var cssrefs = "";
    this.customCSSpath.split(',').map(function(url)
    {
      cssrefs += '<link href="' + url + '" rel="stylesheet" type="text/css" />\n';
    });
    document.write(cssrefs);
  }
};

CustomCSSInjector.prototype._storeCustomCSSpath = function()
{
  if(this.customCSSpath && this._isValidCSSURL(this.customCSSpath))
  {
    window.localStorage.setItem(this.keyForLocalStorage, this.customCSSpath);
  }
};

CustomCSSInjector.prototype._stripInvalidCSSURLs = function()
{
  if(this.customCSSpath)
  {
    this.customCSSpath = this.customCSSpath.split(',').map(function(url)
     {
       var isValid = url.substr(url.length - 4, 4).toLowerCase() === '.css';
       if(!isValid && window.console)
       {
         window.console.error('CustomCSSInjector: Invalid CSS URL found ' + url);
       }
       return  isValid ? url : null;
     }).filter(function(e){ return e; }).join(',');
  }
};

CustomCSSInjector.prototype._setCustomCSSPathFromStorage = function()
{
  this.storedCSSpath = window.localStorage.getItem(this.keyForLocalStorage);
  if(this.storedCSSpath && !this.customCSSpath)
  {
    this.customCSSpath = this.storedCSSpath;
  }
};

CustomCSSInjector.prototype._removeCustomCSSPathFromStorage = function()
{
  if(!this.customCSSpath)
  {
    return;
  }
  if(this.customCSSpath.toLowerCase() === 'off')
  {
    window.localStorage.removeItem(this.keyForLocalStorage);
  }
};

CustomCSSInjector.prototype._isValidCSSURL = function(uri)
{
  /* URL check adapted from
  http://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript#answer-8267900
  */
  var regxp,
    strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
        + "|"
        + "([0-9a-z_!~*'()-]+\.)*"
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
        + "[a-z]{2,6})"
        + "(:[0-9]{1,4})?"
        + "((/?)|"
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
     regxp = new RegExp(strRegex);
     return uri.toString().split(',').map(function(url)
         {
           return regxp.test(url);
         })
         .toString()
         .toLowerCase()
         .indexOf('false') == -1;
};

new CustomCSSInjector();
