document.addEventListener('DOMContentLoaded', function () {
  let loadData = getDataFromCookie('data')

  if (loadData != '') {
    loadData = JSON.parse(loadData)
  } else {
    loadData = []
  }

  let mid_val = 0
  let num_q = 0
  for (var i in loadData) {
    let item = loadData[i]
    if (item['value'] > mid_val) {
      num_q++
      mid_val += parseInt(item['value'])
    }
  }
  mid_val /= num_q
  mid_val = Math.ceil(mid_val)

  num_q = 0

  for (var i in loadData) {
    let item = loadData[i]
    if (item['value'] >= mid_val) {
      num_q++
      var newRow = document.createElement('tr')
      newRow.setAttribute('onclick', "show_q('Вопрос " + item['id'] + "')")
      newRow.setAttribute('data-target', '#exampleModal')
      newRow.setAttribute('data-toggle', 'modal')

      // Создаем ячейки и добавляем их в строку
      var cell1 = document.createElement('td')
      var cell2 = document.createElement('td')
      var cell3 = document.createElement('td')

      // Устанавливаем текстовое содержимое ячеек
      cell1.textContent = num_q
      cell2.textContent = 'Колличество ошибок в вопросе №' + item['id']
      cell3.textContent = item['value']

      // Добавляем ячейки в строку
      newRow.appendChild(cell1)
      newRow.appendChild(cell2)
      newRow.appendChild(cell3)

      // Добавляем новую строку в таблицу
      var tableBody = document.getElementById('tableBody')
      tableBody.appendChild(newRow)
    }
  }
})

// Получаем ссылку на кнопку по её id и добавляем обработчик события при клике на неё
document.getElementById('go-back').addEventListener('click', function () {
  // Изменяем URL-адрес текущего окна на нужную ссылку
  window.location.href = 'index.html' // Замените 'http://example.com' на нужную вам ссылку
})

async function show_q(info) {
  try {
    const data = getQuestions()

    data.forEach((question) => {
      if (question['title'] == info) {
        let answers = ''
        for (var i = 0; i < question['right_answers'].length; i++) {
          answers += question.right_answers[i] + '<br>'
        }

        let text =
          '<b>Вопрос</b>:<br>' +
          question['description'] +
          '<br><br><b>Ответ:</b><br>' +
          answers

        document.getElementById('info-modal').innerHTML = text
        document.getElementById('exampleModalLabel').innerHTML =
          question['title']
      }
    })
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

function clear_all_cookies() {
  clearCookie('data')
  alert('Данные об ошибках удалены!')
  location.reload()
}
