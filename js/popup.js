const derangementButton = document.getElementById('derangementButton');
const videoEmbeddersButton = document.getElementById('videoEmbeddersButton');

chrome.storage.sync.get('myFavoriteColor', function(data) {
    derangementButton.setAttribute('value', data.myFavoriteColor);
    videoEmbeddersButton.setAttribute('value', data.myFavoriteColor);
});

videoEmbeddersButton.onclick = function(element) {
    let activeTabUrl;

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        let tab = tabs[0];
        activeTabUrl = tab.url;
        console.log(JSON.stringify(tab));
        chrome.tabs.create({url: "/tools/video_embedder/video_embedder.html?" + activeTabUrl});
    });


    


    // chrome.tabs.query({
    //     active: true,
    //     currentWindow: true
    // }, function(tabs) {

    // chrome.tabs.executeScript(
    //     tabs[0].id,
    //     {file: '/js/derange.js'}
    // );
    // });
};

derangementButton.onclick = function(element) {
    let myFavoriteColor = element.target.value;

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {

    chrome.tabs.executeScript(
        tabs[0].id,
        // {code: 'document.body.style.backgroundColor = "' + myFavoriteColor + '";'}
        {file: '/js/derange.js'}
    );
  
        // chrome.scripting.executeScript({
        //     function: setTheColor
        // });

        // chrome.runtime.sendMessage(
        //     {greeting: "hello"},
        //     function(response) {console.log(response.farewell);}
        // );
    });
};





// function setTheColor() {
//     document.body.style.backgroundColor = "' + myFavoriteColor + '";
// }