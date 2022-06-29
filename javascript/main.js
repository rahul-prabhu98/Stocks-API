let rxjs = require('rxjs');

const btnFetchApi = document.getElementById('fetchAPI');
const btnXHR = document.getElementById('xhr');
const responseContainer = document.getElementById('responseContainer');
const apiURL = "https://api.worldtradingdata.com/api/v1/stock?symbol=";
const apiKey = "&api_token=QCulWut8PpykyLXwGY7eSzSe3T8sx4hYn4zknAvTNXMeMGrYEkmmTyYjQIs4";
const txtSearch = document.getElementById('txtSearch');
const coll = document.getElementsByClassName("collapsible");
const searchCheckBox = document.getElementById('searchCheckBox');
const autoSearch = document.getElementById('autoSearch');
const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#e74c3c', '#1abc9c'];

let dataResp;

const eventFetchApi = rxjs.fromEvent(btnFetchApi, 'click');
let subFetchApi = eventFetchApi.subscribe(() => getDataFetchApi());

const eventXHR = rxjs.fromEvent(btnXHR, 'click');
let subXHR = eventXHR.subscribe(() => getDataXHR());

const textSearch = rxjs.fromEvent(txtSearch, 'input');
let srcSubscription = textSearch.subscribe((onchange) => {
    if (autoSearch.checked) {
        if (searchCheckBox.checked) {
            getDataXHR();
        } else {
            getDataFetchApi();
        }
        ;
    };
});

const responseClick$ =  rxjs.fromEvent(responseContainer, 'click');
let subscription = responseClick$.subscribe((event) => {
   if (event.target.id == "btnDiv") {
       let target = event.target;

       target.classList.toggle("active");
       let nextContent = target.nextElementSibling;
       if (nextContent.style.display === "block") {
           nextContent.style.display = "none";
       } else {
           nextContent.style.display = "block";
       };
   };
});

let XHRhttpRequest = (method, url) => {

    let promise  = new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => {
            console.log(xhr.responseText);
            dataResp = JSON.parse(xhr.responseText);
            resolve(xhr.response);
        };
        xhr.send();
    });
    return promise;
};

let getDataXHR = () => {
    let url = apiURL + txtSearchParse(txtSearch.value) + apiKey;
    XHRhttpRequest('GET', url).then(responseData => {
        console.log(responseData);
        JSONDataPopulation(dataResp)

    });
};

let getDataFetchApi = () => {
    // alert (txtSearchParse(txtSearch.value));
    let url = apiURL + txtSearchParse(txtSearch.value) + apiKey;
    fetch(url)
        .then(response => {

            return response.json();
        })
        .then(responseJSON => {
            dataResp = responseJSON;
            JSONDataPopulation(dataResp);
            console.log(responseJSON);
        });
};

function JSONDataPopulation(dataResp){

    responseContainer.innerHTML= "";

    for(let keys in dataResp['data']){
        let internalDiv = document.createElement('div');
        let internalTable = document.createElement('table');
        let count = 0;
        let tableData = "";
        let symbol = "";
        let companyName = "";
        console.log("********************New Row*********************");
        Object.keys(dataResp['data'][keys]).forEach(key => {
            if (key == "symbol"){
                symbol = dataResp['data'][keys][key];
            };

            if (key == "name"){
                companyName = dataResp['data'][keys][key];
            };

            console.log(count);
            if (count < 6){
                tableData += "<td>" + keyFormat(key) + ":  " + dataResp['data'][keys][key] + "</td>";
                count++;
            };
            console.log(count);
            if (count == 6){
                console.log('Writing Row');
                let tableRow = document.createElement('tr');
                tableRow.innerHTML = tableData;
                internalTable.appendChild(tableRow);
                tableData = "";
                count = 0;
            };
            console.log(count);
            console.log(key +  " " + dataResp['data'][keys][key]);

        });
        console.log("Writing table");
        internalDiv.appendChild(internalTable);
        internalDiv.classList.add("content");
        internalDiv.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        let btnDiv = document.createElement("button");
        btnDiv.type = "button";
        btnDiv.classList.add("collapsible");
        btnDiv.id = "btnDiv";
        let logooUrl;
        try {
             logooUrl = findLogoLink(symbol, companyName);
        }
        catch {
            logooUrl =  "images/enterprise.png";
        }
        let img = document.createElement('img');
        img.src = logooUrl;
        img.width = 40;
        img.height = 40;
        btnDiv.innerText = symbol + "  |  " + companyName + "   ";
        btnDiv.appendChild(img);

        responseContainer.appendChild(btnDiv);
        responseContainer.appendChild(internalDiv);
        let breakline = document.createElement('br');
        responseContainer.appendChild(breakline);
        console.log("************************");
    };


};

function keyFormat(string){
    let newString;
    newString = string.replace(/_/g, ' ');
    newString = newString.charAt(0).toUpperCase() + newString.substring(1);
    return newString;
};

function txtSearchParse (string){
    return string.replace(/\s/g,'');
};


function findLogoLink(symbol, company) {
    let logoUrl;
    let logoPreFix = "http://logo.clearbit.com/";
    // alert("In for: " + symbol + " " + company);
        logoUrl = logoPreFix + symbol.replace(/[^a-zA-Z ]/g, "_") + ".com?size=45";
        try{
        if (urlExist(logoUrl)){
            // alert("Recur 1: " + logoUrl);
          return logoUrl;
        };}
        catch {
            // alert(getFirstWord(company));
            logoUrl = logoPreFix + getFirstWord(company) + ".com?size=45";
            if (urlExist(logoUrl)){
                // alert("Recur 2: " + logoUrl);
                return logoUrl;
            };
        }

        alert(getFirstWord(company));
        logoUrl = logoPreFix + getFirstWord(company) + ".com?size=45";
        if (urlExist(logoUrl)){
            // alert("Recur 2: " + logoUrl);
            return logoUrl;
        };


        logoUrl = "images/enterprise.png";
        // alert("No logo Found");


        return logoUrl;

};

function urlExist(strurl){
    let request;
    if (window.XMLHttpRequest)
        request = new XMLHttpRequest();
    else
        request = new ActiveXObject("Microsoft.XMLHTTP");
    request.open('GET', strurl, false);
    request.send();
    if (request.status === 200) {
        return true
    } else {false};
};

function getFirstWord(str) {
    let spacePosition = str.indexOf(' ');
    if (spacePosition === -1)
        return str;
    else
        return str.substr(0, spacePosition);
};