
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender){
  var tab_id = sender.tab.id;

  // 2 types for message query or feedback
  if (message.type === 'query'){
    getDismbiguation(message, tab_id);
  }else{
    sendFeedback(message, tab_id);
  }
}

function getDismbiguation(message, tab_id){
  var selected_text = message.selected_text;
  var paragraph = message.paragraph_text;

  console.log(paragraph);

  // Step 1 check word is fully selected
  var re = new RegExp("\\S*"+selected_text+"\\S*");
  var matches = paragraph.match(re);

  if (matches[0]!==selected_text){
    selected_text = matches[0];
  }

  // Step 2 send term & paragraph to server
  var data = {
    term: selected_text,
    paragraph: paragraph,
  };

  var query_format = '?format=json';
  var query_term = 'term='+selected_text;
  var query_paragraph = 'paragraph='+paragraph;

  console.log(paragraph);

  var query_string = query_format + '&' + query_term + '&' + query_paragraph;

  var url = 'http://127.0.0.1:8000/api/searches/' + query_string;

  var options = {
  	method: 'POST',
  };

  fetch(url, options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var message = {};

      console.log(json);

      message.title = json.wikipage.title;
      message.extract = json.wikipage.extract;
      message.search_id = json.id;

      sendSummaryToBrowser(message, tab_id);
    }).catch(function(error) {
      console.log(error);
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
  var feedback = 'correct_wiki_returned='+feedback;

  var query_string = query_format + '&' + feedback;

  var url = 'http://127.0.0.1:8000/api/searches/'+ search_id + '/' + query_string;

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
