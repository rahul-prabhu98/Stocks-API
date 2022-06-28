const btnFetchApi = document.getElementById('fetchAPI');
const btnXHR = document.getElementById('xhr');
const responseContainer = document.getElementById('responseContainer');
const apiURL = "https://api.worldtradingdata.com/api/v1/stock?symbol=";
const apiKey = "&api_token=QCulWut8PpykyLXwGY7eSzSe3T8sx4hYn4zknAvTNXMeMGrYEkmmTyYjQIs4";
const txtSearch = document.getElementById('txtSearch');
let dataResp;

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
    alert (txtSearchParse(txtSearch.value));
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
        console.log("********************New Row*********************");
        Object.keys(dataResp['data'][keys]).forEach(key => {
            console.log(count);
            if (count < 6){
                tableData += "<td>" + key + ":  " + dataResp['data'][keys][key] + "</td>";
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
        responseContainer.appendChild(internalDiv);
        console.log("************************");
    };


};

function txtSearchParse (string){
    return string.replace(/\s/g,'');
};

btnFetchApi.addEventListener('click', getDataFetchApi);
btnXHR.addEventListener('click', getDataXHR);