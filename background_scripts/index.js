
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender){
  var tab_id = sender.tab.id;

  // 2 types for message query or feedback
  if (message.type === 'query'){
    getInformation(message, tab_id);
  }else{
    sendFeedback(message, tab_id);
  }
}

function getInformation(message, tab_id){
  var selected_text = message.selected_text;
  var paragraph_text = message.paragraph_text;

  // Check word is fully selected
  var re = new RegExp("\\S*"+selected_text+"\\S*");
  var matches = paragraph_text.match(re);

  if (matches[0]!==selected_text){
    selected_text = matches[0];
  }

  // Create url for post request
  var query_format = '?format=json';
  var query_term = 'term='+selected_text;
  var query_paragraph = 'paragraph='+paragraph_text;

  var query_string = query_format + '&' + query_term + '&' + query_paragraph;

  var url = 'https://contextualised.pythonanywhere.com/api/searches/' + query_string;

  var options = {
  	method: 'POST',
  };

  // Send term & paragraph to server
  fetch(url, options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var message = {};

      message.title = json.wikipage.title;
      message.extract = json.wikipage.extract;
      message.search_id = json.id;

      sendSummaryToBrowser(message, tab_id);
    }).catch(function(error) {
      var message = {};

      // TODO: dont show feedback buttons if there is an error
      message.title = 'Error';
      message.extract = 'Could not retrieve information about '+selected_text;
      message.search_id = '0';

      sendSummaryToBrowser(message, tab_id);
    });

    function sendSummaryToBrowser(message, tab_id){
      browser.tabs.sendMessage(tab_id, message);
    }
}

function sendFeedback(message, tab_id){
  var feedback = message.feedback;
  var search_id = message.search_id;

  // Need search id and wheter or not it was useful
  var query_format = '?format=json';
  feedback = 'correct_wiki_returned='+feedback;

  var query_string = query_format + '&' + feedback;

  var url = 'https://contextualised.pythonanywhere.com/api/searches/'+ search_id + '/' + query_string;

  var options = {
    method: 'PUT',
  };

  fetch(url, options)
    .then(function(response) {
      console.log(response.ok);
    }).catch(function(error) {
      console.log(error);
    });
}
