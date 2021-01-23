// const { spawnSync } = require('child_process');

// const message = "Hola world";

// spawnSync("powershell.exe", [`
// Add-Type -AssemblyName PresentationCore,PresentationFramework;
// [System.Windows.MessageBox]::Show('${message}');
// `]);


chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "sampleContextMenuHTV",
        "title": "Sample Context Menu HTV",
        "contexts": ["selection"]
    });
    chrome.storage.sync.set(
        {myFavoriteColor: '#0caca0'},
        function() {
            console.log("Check out this awesome color. Its HEX is just as awesome (#0caca0).");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules(
            [
                {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher(
                        {
                            pageUrl: {
                                hostEquals: 'developer.chrome.com'
                            }
                        })
                    ],
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                }
            ]
        );
    });
    
    // chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    //     console.log(sender.tab ?
    //         "from a content script:" + sender.tab.url :
    //         "from the extension");
    //     if (request.greeting == "hello")
    //         sendResponse({
    //             farewell: "goodbye"
    //         });
    //     }
    // );
});

