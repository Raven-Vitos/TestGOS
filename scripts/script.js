var answ_result = {}
var wrong_answers = []

let cout_q = 0
let min_q = 0
let max_q = 0

let cur_num_btn = 0;

let jsonDataFailQ = []

let start_test = false

let cur_q = { id: 1, obj: null };

document.addEventListener('DOMContentLoaded', function () {
 
  cout_q =
    getDataFromCookie('allQInput') != ''
      ? parseInt(getDataFromCookie('allQInput'))
      : 20
  min_q =
    getDataFromCookie('minQInput') != ''
      ? parseInt(getDataFromCookie('minQInput'))
      : 1
  max_q =
    getDataFromCookie('maxQInput') != ''
      ? parseInt(getDataFromCookie('maxQInput'))
      : 1001

  console.log(cout_q, min_q, max_q)

  loadCards()

  loadToCookies()
})

function encodeHtmlEntities(text) {
  let div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Функция для генерации уникальных случайных индексов
function generateUniqueIndices(count, min, max) {
  var indices = []

  // Заполняем массив значениями от min до max
  for (var i = min; i <= max; i++) {
    indices.push(i)
  }

  // Перемешиваем массив
  for (var i = indices.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = indices[i]
    indices[i] = indices[j]
    indices[j] = temp
  }

  // Возвращаем указанное количество уникальных индексов
  return indices.slice(0, count)
}

// Функция для загрузки данных из JSON и создания карточек
async function loadCards() {
  try {
    const data = getQuestions()

    var cards = []

    
    data.forEach((question) => {
      const card = document.createElement('div')
      card.classList.add('card', 'mb-3')

      // Генерируем HTML-код для вариантов ответов
      var answers = []
      Object.keys(question['answers']).forEach((key) => {
        const answer = question['answers'][key]
        answers.push(
          `<button class="btn btn-light" onclick="checkAnswer(this)" style="text-align: left;">${encodeHtmlEntities(answer)}</button>`
        )
      })

      for (var i = 0; i < answers.length; i++) {
        const index = getRandomNumber(0, answers.length - 1);
        [answers[i], answers[index]] = [answers[index], answers[i]]
      }

      let answersHTML = ''
      for (var i = 0; i < answers.length; i++) {
        answersHTML += answers[i]
      }

      card.innerHTML = `
              <div class="card-body">                           
                  
                <div class="tt-cr">
                  <div class="close-btn" onclick="delete_answer(this)">!</div> 
                  <div class="tt">Удалить ответ</div>
                </div>

                <h5 class="card-title" style="display: none;">${question.title}</h5>                
                <p class="card-text mt-1 data-decsript">${question.description}</p>
                <div class="graph">${question["image"]}</div>
                <div class="d-grid gap-2 mt-3">
                  ${answersHTML}
                </div>
                <div class="result mt-3"></div>
              </div>`

      card.answer = question.right_answers
      card.answer_count = question.right_answers.length
      card.answer_enter = []

      cards.push(card)      
    })
    
    // Создаем карточки на основе данных
    const cardsContainer = document.getElementById('cardsContainer')

    var uniqueIndices = generateUniqueIndices(cout_q, min_q - 1, max_q - 1)

    console.log(uniqueIndices)
    let num_btn = 0
    for (var i in uniqueIndices) {
      cards[uniqueIndices[i]].style.display = "none"
      cardsContainer.appendChild(cards[uniqueIndices[i]])

      num_btn++
      const num_block = document.getElementById("btn-questions");
      const btn = document.createElement('button')
      btn.innerHTML = num_btn;
      btn.className = "btn btn-info m-1 btn-sm";
      btn.setAttribute("onClick", "show_need_Q(" + num_btn + ", this)");

      num_block.appendChild(btn)
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }

  const btns = document.getElementById("btn-questions")
  show_need_Q(1, btns.children[0])
}

// Функция для проверки ответа на вопросы
function checkAnswer(button) {
  if (button.block) return

  button.block = true
  const card = button.closest('.card')
  const cardBody = button.closest('.card-body')
  const question = cardBody.querySelector('.card-title').innerText
  const userAnswer = button.innerText
  const resultDiv = cardBody.querySelector('.result')

  // Сравниваем ответ пользователя с правильным ответом
  const showColorResult = document.getElementById('flexCheckResult')
  if (showColorResult.checked) {
    if (card.answer.includes(userAnswer)) {
      button.className = 'btn btn-success'
    } else {
      button.className = 'btn btn-danger'
    }
  } else {
    button.className = 'btn btn-secondary'
  }

  card.answer_enter.push(userAnswer)
  answ_result[question] = false

  if (card.answer_count == card.answer_enter.length) {
    let result = true
    for (var i = 0; i < card.answer_count; i++) {
      if (!card.answer.includes(card.answer_enter[i])) {
        result = false
        break
      }
    }

    answ_result[question] = result
  }
}

// Функция для проверки ответа на вопросы
function showResult(btn) {
  if (!start_test) {
    showTestResult(btn)
  } else {
    resetTest()
  }
}

function showTestResult(btn) {
  let result = 0
  for (var i in answ_result) {
    if (answ_result[i]) result++
  }

  let res = Math.round((result / cout_q) * 100.0)
  let color_result = ''

  if (res >= 90 && res <= 100) color_result = 'info'
  else if (res >= 70 && res <= 89) color_result = 'primary'
  else if (res >= 50 && res <= 69) color_result = 'warning'
  else color_result = 'danger'

  btn.innerText = 'Пройти тест заного?'
  btn.className = 'btn btn-warning'
  document.getElementById('result-test').innerHTML =
    '<div class="alert alert-' +
    color_result +
    ' mt-3" role="alert" id="info-result">Правильно: ' +
    result +
    '/' +
    cout_q +
    '</div>'

  start_test = true

  saveToCookies()

  // Получаем ссылку на элемент img
  var imgElement = document.getElementById('imagePrice')
  // Устанавливаем значение атрибута src
  imgElement.src = ''

  // Устанавливаем значение атрибута alt
  imgElement.alt = 'None'

  switch (color_result) {
    case 'danger':
      imgElement.src = 'contents/images/1.webp'
      imgElement.alt = 'Арлан'
      break
    case 'warning':
      imgElement.src = 'contents/images/2.webp'
      imgElement.alt = 'Цзинь Юань'
      break
    case 'primary':
      imgElement.src = 'contents/images/3.webp'
      imgElement.alt = 'Цзиньлю'
      break
    case 'info':
      imgElement.src = 'contents/images/4.webp'
      imgElement.alt = 'Церный Лебедь'
      break
  }

  var myModal = new bootstrap.Modal(document.getElementById('priceModal'))
  myModal.show()
}

function resetTest() {
  // location.reload();
  window.location.href = 'index.html'
}

function loadToCookies() {
  let loadData = getDataFromCookie('data')

  if (loadData != '') {
    jsonDataFailQ = JSON.parse(loadData)
  } else {
    jsonDataFailQ = []
  }

  console.log('Data:', jsonDataFailQ)

  loadData = getDataFromCookie('show_ans')

  if (loadData != '') {
    const res = JSON.parse(loadData)
    const showColorResult = document.getElementById('flexCheckResult')
    showColorResult.checked = res
  }
}

function saveToCookies() {
  document.getElementById('info-result').innerHTML +=
    '<br>Данные успешно сохранены на сервере.'
  document.getElementById('result-test').innerHTML +=
    '<button type="button" class="btn btn-info" id="showReport" onclick="show_report()" style="width: 300px;">Просмотреть отчет</button>'

  // Цикл для добавления объектов в массив
  for (var ans in answ_result) {
    if (!answ_result[ans]) {
      addParam(jsonDataFailQ, get_id_question(ans))
    }
  }

  saveDataToCookie('data', JSON.stringify(jsonDataFailQ), 30)
}

function get_id_question(str) {
  // Регулярное выражение для поиска числа после слова "Вопрос"
  var regex = /Вопрос (\d+)/

  // Выполнение поиска с помощью регулярного выражения
  var match = str.match(regex)

  // Если найдено совпадение, получаем число из группы совпадения
  if (match) {
    var questionNumber = parseInt(match[1]) // Преобразуем найденное число в целое число
    return questionNumber // Выводим результат в консоль
  }

  return 0
}

function show_report() {
  // Изменяем URL-адрес текущего окна на нужную ссылку
  window.location.href = 'report.html'
}

// Обработчик события отправки формы
document
  .getElementById('settingsForm')
  .addEventListener('submit', function (event) {
    event.preventDefault() // Предотвращаем отправку формы по умолчанию

    var allQ = document.getElementById('allQInput').value
    var minQ = document.getElementById('minQInput').value
    var maxQ = document.getElementById('maxQInput').value

    saveDataToCookie('allQInput', allQ, 30)
    saveDataToCookie('minQInput', minQ, 30)
    saveDataToCookie('maxQInput', maxQ, 30)

    const showColorResult = document.getElementById('flexCheckResult')
    saveDataToCookie('show_ans', JSON.stringify(showColorResult.checked), 30)

    resetTest()
  })


  function show_need_Q(num, btn) {
    cur_num_btn = num
    const current_card = document.getElementById("cardsContainer");

    if (cur_q.obj) {

      const title = current_card.children[cur_q.id - 1].querySelector('.card-title').innerHTML
      if (title in answ_result) {
        cur_q.obj.className = "btn btn-light m-1 btn-sm";
      } else {
        cur_q.obj.className = "btn btn-info m-1 btn-sm";
      }

      current_card.children[cur_q.id - 1].style.display = "none"
    }


    cur_q.id = num
    cur_q.obj = btn

    const title = current_card.children[cur_q.id - 1].querySelector('.card-title').innerHTML
    btn.className = "btn btn-primary m-1 btn-sm";  

    current_card.children[cur_q.id - 1].style.display = "flex"
  }

  function delete_answer(btn) {
    if (start_test) return;

    const card = btn.parentElement.parentElement.parentElement;
    card.answer_enter = []

    const btns = card.querySelector(".d-grid")

    for (var i = 0; i < btns.children.length; i++)
    {
      btns.children[i].block = false
      btns.children[i].className = "btn btn-light" 
    }

    const title = card.querySelector(".card-title").innerHTML
    delete answ_result[title];
}

function next_q() {
  const list_btn = document.getElementsByClassName("btn-sm");

  if (cur_num_btn < list_btn.length)
    list_btn[cur_num_btn].onclick();
}

function prev_q() {
  const list_btn = document.getElementsByClassName("btn-sm");

  if (cur_num_btn - 2 >= 0)
    list_btn[cur_num_btn-2].onclick(); 
}