#! /usr/bin/env python3

from docx import Document
import re


file_input = 'data/documents/history.docx'
file_output = 'data/database/questions.js'


class JSON_Object:
    def set_title(self, title):
        self.title = title

    def set_description(self, description):
        self.description = description

    def set_answer(self, answer):
        self.answer = answer

    def set_answers(self, answers):
        self.answers = answers

    def get_title(self):
        return self.title

    def get_description(self):
        return self.description

    def get_answer(self):
        return self.answer

    def get_answers(self):
        return self.answers


def gen_json(ob):   
    
    title = ob.get_title()
    description = ob.get_description()
    answer = ''
    answers = ''

    for ans in ob.get_answer():
        answer += '\t\t\t"' + ans + '",\n'

    answer = answer[:-2] + '\n'
    
    for ans in ob.get_answers():
        answers += '\t\t\t"' + ans + '",\n'

    answers = answers[:-2] + '\n'


    return '\t{\n'                                      \
    '\t\t"title": "' + title + '",\n'                   \
    '\t\t"description": "' + description + '",\n'       \
    '\t\t"right_answers": [\n' + answer + '\t\t],\n'  \
    '\t\t"answers": [\n' + answers  + '\t\t]\n'         \
    '\t}'


# Открыть файл Word
doc = Document(file_input)

def check_q(q):
    res = re.findall("^\d+\.\s", q)
    return res != []


doc_p = []
for paragraph in doc.paragraphs:
    is_answ = False
    for run in paragraph.runs:
        if run.bold:
            is_answ = True

    if is_answ:
        doc_p.append('+' + paragraph.text)
    else:
        doc_p.append(paragraph.text)

test_count = []


def crear_file(file_path):
    # Открытие файла в режиме чтения и записи
    with open(file_path, 'r+') as file:
        file.truncate(0)  # Обрезка файла до размера 0


def gen_ob(document):
    global test_count
    obects = []
    ip = 0
    
    file_data = '[\n'

    n_q = 0

    while ip < len(document):
        title = ''
        description = ''
        answer = []
        answers = []
        n_q += 1

        if check_q(document[ip]):   
            num_q = re.findall("^\d+\.\s", document[ip])[0] 

            if not num_q[:-2] in test_count:
                test_count.append(num_q[:-2])
            else:
                print("Повторяется: ", num_q[:-2])
                test_count.append(num_q[:-2])

              
            description = document[ip][len(num_q):].strip()
            ip += 1

            title = "Вопрос " + str(n_q)  

            file_data += '\t{ "id": ' + str(n_q) + ', "value": 0 },\n'
            while ip < len(document) and not check_q(document[ip]):
                if document[ip][0] == '+':
                    answer.append(document[ip][1:].strip())
                    answers.append(document[ip][1:].strip())
                else:
                    answers.append(document[ip].strip())

                ip += 1

            ob = JSON_Object()
            ob.set_title(title)
            ob.set_description(description)
            ob.set_answer(answer)
            ob.set_answers(answers)

            json_ob = gen_json(ob)

            obects.append(json_ob)

    return obects


with open(file_output, 'w', encoding="utf-8") as file:
    doc = 'const questions = [\n'
    for ob in gen_ob(doc_p):
        doc += ob
        doc += ',\n'

    doc = doc[:-2] + '\n'
    doc += '];'

    file.write(doc)


print("Всего вопросов", len(test_count))