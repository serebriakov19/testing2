function validation(test) {
    if (test.name === '' || test.subject === '') {
        return false;
    } else {
        for (let object of test.questions) {
            if (object.question === '') {
                return false;
            } else {
                let hasCorrectAnswer = false;
                for (let obj of object.answers) {
                    if (obj.answer === '') {
                        return false;
                    } else {
                        if (obj.correct === true) {
                            hasCorrectAnswer = true;
                        }
                    }
                }
                if (hasCorrectAnswer === false) {
                    return false;
                }
            }
        }
    }
    return true;
}

module.exports = validation;