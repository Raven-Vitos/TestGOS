with open("questions_.js", 'r', encoding="utf-8") as file:
    num = 0
    file_out = open("questions.js", 'w', encoding="utf-8")
    for row in file.readlines():
        if '"title":' in row:
            num += 1
            n = row.index(':')
            
            print(row, end='')   
            row = row[:n] + f': "Вопрос {num}",\n' 
            print(row)
            print()
            
        file_out.write(row)