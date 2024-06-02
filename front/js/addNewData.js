let inputSubmit = document.querySelector(".save");

let data = {};


// проверка на размер фото
document.querySelector(".photo input").onchange = function() {
    if(this.files[0].size > 16000000) {
       alert("File is too big!");
       this.value = "";
    }
};

// проверка на заполнение обезательных данных
function checkAllInputs(){
    let dataGood = true;
    let inputsNames = ['name','surname','patronymic','jobTitle','phoneNumber','payment','dateOfJobStart','photo']
    
    inputsNames.forEach((item) => {
        if (document.querySelector(`.${item} input`).value == "") {
            document.querySelector(`.${item}`).style.border = "red solid 2px"
            dataGood = false;
        } else {
            document.querySelector(`.${item}`).style.border = "red solid 0px"
        }
    })
    if (!isnum(document.querySelector(".payment input").value)){
        document.querySelector(`.payment`).style.border = "red solid 2px"
        dataGood = false;
    } else {
        document.querySelector(`.payment`).style.border = "red solid 0px"
    }
    return dataGood

}
// нажатие кнопки
inputSubmit.addEventListener('click', ()=>{
    // добавить проверку   
    if(!checkAllInputs()){
        return
    }  
    
    convertImageToBase64(document.querySelector(".photo input").files[0],updateData,sendData);
})

//конвертирует фото в base64 и вызывает callback
function convertImageToBase64(file,callback,callback2){ //document.querySelector(".photo input").files[0]
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function(){
        callback(fileReader.result,callback2)
    }
}
// собираем данные
function updateData (photoDataBase64,callback) {
    data = {
        name: document.querySelector(".name input").value,
        surname: document.querySelector(".surname input").value,
        patronymic: document.querySelector(".patronymic input").value,
        jobTitle: document.querySelector(".jobTitle input").value,
        phoneNumber: document.querySelector(".phoneNumber input").value,
        email: document.querySelector(".email input").value,
        payment: document.querySelector(".payment input").value,
        dateOfJobStart: document.querySelector(".dateOfJobStart input").value,
        address: document.querySelector(".address input").value,
        photo: photoDataBase64,
        additional: document.querySelector(".additional input").value
    }
    console.log(data)
    callback(data);
}

//отправка данных
function sendData (data) {
    fetch("http://localhost:3000/addingNewData",{
        method : "post",
        headers: {
            "Accept": 'application/json',
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    });
}
// проверка на числа
function isnum (val){return /^\d+$/.test(val);} 
