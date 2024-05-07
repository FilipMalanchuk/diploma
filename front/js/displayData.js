let dataFromServer = [];
let idOfChange = "";
let DataToChangeTo = {};


// получаем данные с БД
async function getData() {
    await fetch("http://localhost:3000/showData")
    .then(response => response.json())
    .then(data => {
        dataFromServer = JSON.parse(JSON.stringify(data));
        console.log(data)
        addElements(data)    
    })
   
    
}
// добавление элементов на страницу из json данных
function addElements(data){
    let strToAdd = ``;

    for (let i = 0;i<data.length - 1;i++){
        let d = data[i];
        strToAdd+=`<div class="dataItem">\n` //начало
        strToAdd+=`<span class="id hidden" hidden>${d._id}</span>\n`
        //strToAdd+=`<img src="${data[data.length-1].imagesBase64[i]}" alt="" class="photo">\n`
        strToAdd+=`<div class="photo" style="background-image: url('${data[data.length-1].imagesBase64[i]}');"></div>`
        strToAdd+=`<p class="wholeName">
        <span class="name">${d.name}</span>
        <span class="surname">${d.surname}</span>
        <span class="patronymic">${d.patronymic}</span>\n</p>\n`
        strToAdd+=`<p class="jobTitle">`
        for(let y=0;y<d.jobTitle.length;y++){
            strToAdd+=`${d.jobTitle[y]} `
        }
        strToAdd+=`</p>\n`
        strToAdd+=`<p class="payment">${d.payment}$</p>\n`
        strToAdd+=`<p class="phoneNumber hidden">${d.phoneNumber}</p>\n`
        if(d.hasOwnProperty("email")){strToAdd+=`<p class="email hidden">${d.email}</p>\n`}
        if(d.hasOwnProperty("address")){strToAdd+=`<p class="address hidden">${d.address}</p>\n`}
        strToAdd+=`<p class="dateOfJobStart hidden">${d.dateOfJobStart}</p>\n`

        if(d.hasOwnProperty('additional')){
            strToAdd+=` <p class="aditional hidden">`
            for(let y=0;y<d.additional.length;y++){
                strToAdd+=`${d.additional[y]} `
        }
            strToAdd+=`</p>\n`
        }
        strToAdd+=`<span class="expand"></span> `
        strToAdd+=`<span class="close hidden"></span> `
        strToAdd+=`<span class="change hidden"></span>`
        strToAdd+=`</div>` // конец
    }

    document.getElementById("data").innerHTML = strToAdd;
    
    // вызываем добавление ивентов для новых элементов
    addEvents();
}

function addEvents(){
    
    // открытие конкретного профиля на весь экран
    document.querySelectorAll(".expand").forEach(item => item.addEventListener("click",(event)=> {
        expand(event);
    }))   
// закрытие открытого профиля
    document.querySelectorAll(".close").forEach(item => item.addEventListener("click",(event)=> {
        close(event)
    }))  

    document.querySelectorAll(".change").forEach(item => item.addEventListener("click", (event)=> {
        let elemTarget = event.target;
        let parent = event.target.parentElement;
        swapToInputs(parent,elemTarget);
    }))
}
 // открытие конкретного профиля на весь экран
function expand(event) {
    let elemTarget = event.target;
    let parent = event.target.parentElement;
    let closeElem = parent.querySelector(".close");
    let changeElem = parent.querySelector(".change")
    closeElem.classList.remove("hidden");
    changeElem.classList.remove('hidden')
    elemTarget.classList.add("hidden");
    parent.classList.add("parentExpanded");
    addRemoveHidden("remove",parent);
}
// закрытие открытого профиля
function close(event) {
    let elemTarget = event.target;
    let parent = event.target.parentElement;
    let expandElem = parent.querySelector(".expand");
    let changeElem = parent.querySelector(".change")
    expandElem.classList.remove("hidden");
    changeElem.classList.add('hidden')
    elemTarget.classList.add("hidden");
    parent.classList.remove("parentExpanded");
    addRemoveHidden("add",parent);
}

// отображает скрытые данные
function addRemoveHidden (command,target) {
    let targets = ["phoneNumber","email","address","dateOfJobStart","aditional"]
    targets.forEach(item => {
        if(command === "remove") {
            target.querySelector(`.${item}`).classList.remove("hidden")
        } else if (command === "add") {
            target.querySelector(`.${item}`).classList.add("hidden")
        } else {
            console.log("error in addRemoveHidden")
        }
    })
}

function swapToInputs (parent,target) {
    let id = parent.querySelector(".id").innerHTML
    idOfChange = id;
    let d = dataFromServer.find(item => item._id == id);
    let inputs = `<div class="textInputs">
    <div class="name"><span>Ім'я</span> <input type="text" value="${d.name}"></div>
    <div class="surname"><span>Прізвище</span> <input type="text" value="${d.surname}"></div>
    <div class="patronymic"><span>По батькові</span> <input type="text" value="${d.patronymic}"></div>
    <div class="jobTitle"><span>Посада</span> <input type="text" value="${d.jobTitle}"></div>
    <div class="phoneNumber"><span>Телефон</span> <input type="text" value="${d.phoneNumber}"></div>
    <div class="email"><span>e-mail</span> <input type="text" value="${d.email}"></div>
    <div class="payment"><span>Зарплата</span> <input type="text" value="${d.payment}"></div>
    <div class="dateOfJobStart"><span>Дата прийняття на роботу</span> <input type="text" value="${d.dateOfJobStart}"></div>
    <div class="address"><span>Адреса</span> <input type="text" value="${d.address}"></div>
    <div class="photo changingPhoto"><span>Фото</span> <input type="file" accept="image/png, image/jpeg"> <input type="checkbox" class="changePhoto"></div>
    <div class="additional"><span>Додаткові дані</span> <input type="textarea" value="${d.additional}"></div>`;
    inputs+="<span class='save'>Зберігти</span> <span class='cancel'>Відмінити</span>"
    
    parent.innerHTML = inputs
    parent.querySelector(".save").addEventListener('click',(event) => saveNewData(parent,d,id))
    parent.querySelector(".cancel").addEventListener('click',event => cancel(parent))
    
}

function saveNewData(parent, elemFromDataServer,id){
    console.log(parent,id)
    if(!checkAllInputs(parent)){
        return
    }
    if (parent.querySelector(".changePhoto").checked) {
        convertImageToBase64(parent.querySelector(".photo input").files[0],updateData,sendData,id);
    } else {
        updateData(false, sendData,id)
    }
    
    

}
function cancel(parent){
    console.log("cancel")
    parent.classList.remove("parentExpanded");
    addElements(dataFromServer);
}

function isnum (val){return /^\d+$/.test(val);} 

function checkAllInputs(parent){
    let dataGood = true;
    let inputsNames = ['name','surname','patronymic','jobTitle','phoneNumber','payment','dateOfJobStart']
    
    inputsNames.forEach((item) => {
        if (parent.querySelector(`.${item} input`).value == "") {
            parent.querySelector(`.${item}`).style.border = "red solid 2px"
            dataGood = false;
        } else {
            parent.querySelector(`.${item}`).style.border = "red solid 0px"
        }
    })
    if (!isnum(parent.querySelector(".payment input").value)){
        parent.querySelector(`.payment`).style.border = "red solid 2px"
        parent = false;
    } else {
        parent.querySelector(`.payment`).style.border = "red solid 0px"
    }
    let checkedPhoto = parent.querySelector(".changePhoto");
    let photo = parent.querySelector(`.photo`);
    let photoInput = parent.querySelector(`.photo input`);
    if (checkedPhoto.checked) {
        if (photoInput.value == "") {
            photo.style.border = "red solid 2px"
            dataGood = false;
        } else {
            photo.style.border = "red solid 0px"
            if (photoInput.files[0].size > 16000000) {
                alert("File is too big!");
                photoInput.value = "";
                dataGood = false;
            }
        }
    } else {
        photo.style.border = "red solid 0px"
    }
    return dataGood

}



//конвертирует фото в base64 и вызывает callback
function convertImageToBase64(file,callback,callback2,id){ //document.querySelector(".photo input").files[0]
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function(){
        callback(fileReader.result,callback2,id)
    }
}
// собираем данные
function updateData (photoDataBase64,callback,id) {
    let data = {}
    data = {
        _id : id,
        name: document.querySelector(".name input").value,
        surname: document.querySelector(".surname input").value,
        patronymic: document.querySelector(".patronymic input").value,
        jobTitle: [document.querySelector(".jobTitle input").value],
        phoneNumber: document.querySelector(".phoneNumber input").value,
        email: document.querySelector(".email input").value,
        payment: document.querySelector(".payment input").value,
        dateOfJobStart: document.querySelector(".dateOfJobStart input").value,
        address: document.querySelector(".address input").value,
        additional: document.querySelector(".additional input").value
    }
    let changePhoto = false
    if (photoDataBase64 != false) {
        data.photo = photoDataBase64;
        changePhoto = true;
    }
    console.log(data)
    DataToChangeTo = JSON.parse(JSON.stringify(data));
    callback(data,id,changePhoto);
}

//отправка данных
async function sendData (data,id,changePhoto) {
    fetch("http://localhost:3000/changingData",{
        method : "post",
        headers: {
            "Accept": 'application/json',
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    }).then(res => console.log(res));
    updateDataFromServer(id,changePhoto)
}

function updateDataFromServer(id,changePhoto){
    let indexOfObjToChange = dataFromServer.findIndex(obj => obj._id === id)
    
    dataFromServer[indexOfObjToChange] = DataToChangeTo;
    console.log(dataFromServer)
    console.log(DataToChangeTo)
    if(changePhoto){
        dataFromServer[dataFromServer.length-1].imagesBase64[indexOfObjToChange] = DataToChangeTo.photo
    }
    
    addElements(dataFromServer)
    
}








getData()

