
// Сохраняем данные в куки
function saveDataToCookie(key, value, daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    var expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}


// Получаем данные из куки
function getDataFromCookie(key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}


function clearCookie(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


function addParam(data, targetId) {
    // Флаг для обозначения наличия искомого параметра
    var found = false; 

    // Перебираем элементы массива data
    for (var i = 0; i < data.length; i++) {
      // Проверяем, существует ли параметр "id" с искомым значением
      if (data[i].id === targetId) {
        found = true;
        data[i].value++
        break; // Если найдено, прерываем цикл
      }
    }
    
    // Если параметр не найден, добавляем новый объект в массив
    if (!found) {
      data.push({ "id": targetId, "value": 1 });
    } 
}