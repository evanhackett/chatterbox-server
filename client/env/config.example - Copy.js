// This file is an example of the config.js file referenced in index.html 
// The real file has the actual Parse API keys, and will not be committed to git 
if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "PARSE_APP_ID");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "PARSE_API_KEY");
});
