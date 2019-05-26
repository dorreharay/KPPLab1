const readlineSync = require('readline-sync');
const fs = require('fs');
const animalsJSON = fs.readFileSync('data.json', 'utf8');
const gameDB = JSON.parse(animalsJSON);
const animals = gameDB.animals;
const questions = gameDB.questions;

function startQuiz() {
    let answer;
    let data = JSON.parse(animalsJSON).animals;
    let newAnimalQuestions = [];
    data.map((obj) => {
        obj.matchChance = 0;
        return obj;
    })
    questions.forEach((question) => {
        answer = readlineSync.question(`${question}\n`);
        if (answer == "+" || answer == "-") {
            for (let i = 0; i < data.length; i++) {
                if (isValidAnimal(answer, data[i], question)) {
                    data[i].matchChance++;
                } else {
                    data.splice(i, 1);
                    i--;
                }
            }
        }
        if (answer == "+")
            newAnimalQuestions.push(question);
    })
    if (data.length != 0)
        return endGame(true, data.reduce((prev, current) => { return (prev.y > current.y) ? prev : current }), newAnimalQuestions);

    return endGame(false)
}

function isValidAnimal(answer, obj, question) {
    if ((answer == "+" && obj.questions.indexOf(question) > -1) ||
            (answer == "-" && obj.questions.indexOf(question) == -1)) {
        return true;
    }
    return false;
}

function endGame(success, animal, matchedQuestions) {
    if (success) {
        let answer, newAnimal, newQuestion;
        if (animal.name != "undefined") {
            possibleAnimal = animal.name;
            answer = readlineSync.question(`Це - ${possibleAnimal}\n`);
            if (answer == "-") {
                newAnimal = readlineSync.question(`Я програв!\nЩо це за тварина?\n`);
                newQuestion = readlineSync.question(`Наведіть питання яке допоможе відрізнити цю тварину від "${possibleAnimal}":\n`);
                questions.push(newQuestion)
                animals.push({name : newAnimal, questions: [newQuestion].concat(matchedQuestions)})
                fs.writeFile('data.json', JSON.stringify(gameDB), 'utf-8', function(err) {
                    if (err) throw err
                    console.log('Done!')
                });
            }
            return 0
        }
    } else {
        console.log("Щось не так");
    }

    return 0;
}

function start(){
    return startQuiz()
}


start()
