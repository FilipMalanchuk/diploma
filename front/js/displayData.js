let dataFromServer = [];


// получаем данные с БД
async function getData() {
    await fetch("http://localhost:3000/showData")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        addElements(data)    
    })
   
    
}
// добавление элементов на страницу из json данных
function addElements(data){
    let strToAdd = ``;

    for (let i = 0;i<data.length - 1;i++){
        let d = data[i];
        console.log(d)
        strToAdd+=`<div class="dataItem">\n` //начало
        strToAdd+=`<span class="id" hidden>${d._id}</span>\n`
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
        strToAdd+=`</div>` // конец
    }

    document.getElementById("data").innerHTML = strToAdd;
    
    // вызываем добавление ивентов для новых элементов
    addEvents();
}

function addEvents(){
    
    // открытие конкретного профиля на весь экран
document.querySelectorAll(".expand").forEach(item => item.addEventListener("click",(event)=> {
    console.log(event);
    let elemTarget = event.target;
    let parent = event.target.parentElement;
    let closeElem = parent.querySelector(".close");
    closeElem.classList.remove("hidden");
    elemTarget.classList.add("hidden");
    parent.classList.add("parentExpanded");
    addRemoveHidden("remove",parent);
}))   
// закрытие открытого профиля
document.querySelectorAll(".close").forEach(item => item.addEventListener("click",(event)=> {
    console.log(event);
    let elemTarget = event.target;
    let parent = event.target.parentElement;
    let expandElem = parent.querySelector(".expand");
    expandElem.classList.remove("hidden");
    elemTarget.classList.add("hidden");
    parent.classList.remove("parentExpanded");
    addRemoveHidden("add",parent);
}))  
}

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
















getData()

