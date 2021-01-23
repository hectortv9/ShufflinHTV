let toggleHideShow = function toggleHideShow(element) {
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

const $ = document.querySelector.bind(document);
const urlElem = $("#url");
const iframeElem = $("iframe");
urlElem.addEventListener('change', (e) => {
    const url = urlElem.value.trim();
    if (url) {
        iframeElem.src = getVideoEmbedUrl(url);
    }
});
const toggleHideShowButton = $(".toggleHideShowButton");
toggleHideShowButton.addEventListener("click", (e) => {
    toggleHideShow(e.target.nextElementSibling);
});

// This is to make the bookmarklet work.
if (window.location.search.substr(1) != "") {
    iframeElem.src = getVideoEmbedUrl(decodeURIComponent(window.location.search.substr(1)));
}

function getVideoEmbedUrl(url) {
    url = url.replace('http://', 'https://');
    if (url.indexOf('twitch.tv') > 0) {
        var url2 = ''
        url2 += 'https://player.twitch.tv/?enableExtensions=true&muted=false&parent=greggman.github.io&player=popout&video='
        url2 += url.substr(url.lastIndexOf('/') + 1)
        url = url2
    } else if (url.indexOf('embed') < 0) {
        const params = getParams(url);
        params.autoplay = 1;
        if (params.v) {
            url = "https://www.youtube.com/embed/" + encodeURIComponent(params.v);
        } else if (params.list) {
            url = "https://www.youtube.com/embed/videoseries";
        }
        url += makeSearchUrl(params) + getHash(url);
    }
    return url;
}

function getHash(url) {
    const a = document.createElement('a');
    a.href = url;
    return a.hash;
}

function makeSearchUrl(params) {
    return '?' + Object.keys(params).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}

function getParams(url) {
    const a = document.createElement('a');
    a.href = url;
    const params = {};
    const search = a.search;
    if (search) {
        search.substring(1).split("&").forEach(pair => {
            const keyValue = pair.split('=').map(decodeURIComponent);
            params[keyValue[0]] = keyValue[1];
        });
    }
    return params;
}
