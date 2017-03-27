// Waits for a message to be passed from index.js and generates modal
browser.runtime.onMessage.addListener(createModal);

var search_id;

function createModal(message, sender) {
  search_id = message.search_id;

  // Creates div elements
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal" );

  var modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modalContent" );

  var closeButton = document.createElement('span');
  closeButton.setAttribute("class", "close" );
  var closeButtonContent = document.createTextNode("\u00D7");

  var positiveFeedbackButton = document.createElement('span');
  positiveFeedbackButton.setAttribute("class", "positivefeedback" );
  var positiveFeedbackButtonContent = document.createTextNode("This was relevant");

  var negativeFeedbackButton = document.createElement('span');
  negativeFeedbackButton.setAttribute("class", "negativefeedback" );
  var negativeFeedbackButtonContent = document.createTextNode("This wasn't relevant");

  var heading = document.createElement("div");
  heading.setAttribute("class", "modalHeading");
  var headingContent = document.createTextNode(message.title);

  var paragraph = document.createElement("div");
  paragraph.setAttribute("class", "modalTextContent");
  var textContent = document.createTextNode(message.extract);

  var br = document.createElement("br");

  // Generate modal structure
  modal.appendChild(modalContent);
  modalContent.appendChild(closeButton);
  closeButton.appendChild(closeButtonContent);
  modalContent.appendChild(heading);
  heading.appendChild(headingContent);
  modalContent.appendChild(paragraph);
  paragraph.appendChild(textContent);
  modalContent.appendChild(br);
  modalContent.appendChild(positiveFeedbackButton);
  positiveFeedbackButton.appendChild(positiveFeedbackButtonContent);
  positiveFeedbackButton.appendChild(br);
  modalContent.appendChild(negativeFeedbackButton);
  negativeFeedbackButton.appendChild(negativeFeedbackButtonContent);

  // Append modal to the web page
  document.body.appendChild(modal);

  // Close modal
  closeButton.onclick = function() {
    modal.remove();
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.remove();
    }
  };

  positiveFeedbackButton.onclick = function() {
    browser.runtime.sendMessage({"type": "feedback", "search_id": search_id ,"feedback": true});

    modal.remove();
    // send message
  };

  negativeFeedbackButton.onclick = function() {
    browser.runtime.sendMessage({"type": "feedback", "search_id": search_id ,"feedback": false});

    modal.remove();
    // send message
  };
}
