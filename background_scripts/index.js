
browser.runtime.onMessage.addListener(getDismbiguation);

function getDismbiguation(message, sender){
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

  query_format = '?format=json';
  query_term = 'term='+selected_text;
  query_paragraph = 'paragraph='+paragraph;

  console.log(paragraph);

  query_string = query_format + '&' + query_term + '&' + query_paragraph;

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

      sendSummaryToBrowser(message, sender.tab.id);
    }).catch(function(error) {
      console.log(error);
    });

    function sendSummaryToBrowser(message, tab_id){
      browser.tabs.sendMessage(tab_id, message);
    }
}
