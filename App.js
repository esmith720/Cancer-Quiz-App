import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {QuizData} from './components/QuizData';
import { LinearGradient } from 'expo-linear-gradient';
import {MoreInformation} from './components/MoreInformation';

export default function App() {

  //The argument for useState is the default state.
  const [currentScore, setScore] = useState(0); //how many questions user answered correctly
  const [userAnswer, setUserAnswer] = useState(''); //for nextQuestionHandler() to check if answer is correct
  const [quizIsFinished, setQuizFinished] = useState(false); 
  const [readDisclaimer, setReadDisclaimer] = useState(false); //whether or not the user visited the disclaimer on the first page
  const [questions, setQuestions] = useState([0, 1, 2, 3, 4]); //The randomly generated questions that will be a part of the user's quiz.
  const [currentQuestion, setQuestion] = useState(0); //currentQuestion is an index into the 'questions' array of randomly chosen question ID's.
  const options = QuizData[questions[currentQuestion]].options; //the options the user can select from for the current question
  const [checkingAnswer, setCheckingAnswer] = useState(false); //whether or not the user should be brought to the information page on a question
  const [information, setInformation] = useState(['']); //array of array of strings containing information about a question
  const screenWidth = Math.round(Dimensions.get('window').width);

  const nextQuestionHandler = () => {
    if(userAnswer === QuizData[questions[currentQuestion]].answer){
      setScore(currentScore + 1); //If the user got the right answer, increase score by 1.
    }
    setQuestion(currentQuestion + 1); //Move on to the next question.
    setUserAnswer(''); //Reset user answer to empty string so user will choose new answer for each question.
    setCheckingAnswer(false); //The user is done reading the more information page on a question and is ready to move on to the next question.
  }

  const selectAnswerHandler = (userChoice) => {
    setUserAnswer(userChoice);
  }

  const finishHandler = () => {
    //Increment answer if last answer is correct and quiz is not marked as complete yet.
    if(userAnswer === QuizData[questions[currentQuestion]].answer && !quizIsFinished){ 
      setScore(currentScore + 1);
    }
    setQuizFinished(true);
  }

  const retakeQuizHandler = () => {
    setReadDisclaimer(false); //Have the user read the disclaimer again.
    setQuizFinished(false); //Record that the quiz is not finished.
    setScore(0); //Set user score to 0 again.
    setUserAnswer(''); //Set user answer back to an empty string.
    setCheckingAnswer(false); //Record that the user is not currently reading a more information page on a question.

    // //Randomly choose 5 questions from the QuizData.js file.
    // const questionsArray = [];
    // while(questionsArray.length != 5){
    //   randomInt = Math.floor(Math.random() * QuizData.length); //Randomly choose a question ID number.
    //   if(!questionsArray.includes(randomInt)){  //If the question is not already in questionsArray, add it to questionsArray.
    //     questionsArray.push(randomInt);
    //   }
    // }
    // setQuestions(questionsArray); //Put the 5 randomly chosen question ID's in the questions array.
    
    setQuestion(0); //Set the question back to the first question in the questions array.
  }

  const remove = (element, array) => { //helper function for startQuizHandler() function, to remove element from array
    const newArray = [];
    for(i = 0; i < array.length; i++){
      if(array[i] != element){
        newArray.push(array[i]);
      }
    }
    return newArray;
  }

  const startQuizHandler = () => {
    setReadDisclaimer(true); //Record that the user has read the disclaimer message.

    //Randomly choose questions from the QuizData.js file.
    const questionsArray = []; //Will contain the question ID's in a random order.
    let remainingQuestions = [];
    for(i = 0; i < QuizData.length; i++){
      remainingQuestions.push(i); //Put all question ID's in remainingQuestions array in ascending order. Next, this array will be shuffled randomly.
    }

    while(questionsArray.length != QuizData.length){ //while not all of the question ID's have been added to questionsArray
      randomInt = Math.floor(Math.random() * remainingQuestions.length); //Randomly choose a question ID remainingQuestions array.
      questionsArray.push(remainingQuestions[randomInt]);
      remainingQuestions = remove(remainingQuestions[randomInt], remainingQuestions); //Remove question ID from remainingQuestions since it was already added to questionsArray.
    }
    setQuestions(questionsArray); //Put the randomly chosen question ID's in the questions array.
  }

  const checkAnswerHandler = () => {
    setCheckingAnswer(true);
    let arrayInfo = [];
    for(i = 0; i < MoreInformation[questions[currentQuestion]].bolded.length; i++){
      section = [];
      section.push(MoreInformation[questions[currentQuestion]].bolded[i]); //Add heading text.
      section.push(MoreInformation[questions[currentQuestion]].unbolded[i]); //Add paragraph text.
      arrayInfo.push(section);
    }
    setInformation(arrayInfo);
  }

  //Map questions to buttons between question and next button.
  return (
          <View style={styles.container}>
          {/* <LinearGradient colors={['#1c9fa3', '#1c9fa3']} style={styles.gradient}> */}
          {!readDisclaimer && 
            <View style={styles.information}>
              <Text style={styles.disclaimerText}>
              <Text style={styles.disclaimerText, {fontWeight: 'bold'}}>Disclaimer: {'\n'}</Text>
                This app is not a substitute for professional medical advice and is intended 
                for entertainment purposes only. {"\n"} 
                Please consult with your health provider if you have questions 
                regarding health conditions.
              </Text>

              <View>
                <TouchableOpacity onPress={() => startQuizHandler()} style={styles.readDisclaimerButton}>
                  <View>
                    <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>I have read the disclaimer.</Text>
                  </View>
                </TouchableOpacity>
              </View>
    
            </View>
          }

          {(!quizIsFinished && readDisclaimer && !checkingAnswer) &&
            <View style={styles.container}>

              <View style={styles.heading}>
                <View style={{flex: 1}}>
                  </View>
                <View style={{flex: 1}}>

                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                     <Text style={styles.headingText, {fontSize: 0.05 * screenWidth, color: '#0081d6', fontWeight: 'bold'}}>Question {currentQuestion + 1} of {questions.length}</Text>
                    </View>

                    <View style={{flex: 1}}>
                      <Text style={styles.headingText, {fontSize: 0.05 * screenWidth, textAlign: 'right', color: '#0081d6', fontWeight: 'bold'}}>Score: {currentScore} / {questions.length}</Text>
                    </View>

                  </View>             
               
                </View>
                  <View style={{flex: 1}}>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 0.06 * screenWidth, fontWeight: 'bold', color: '#0081d6', paddingLeft: 15, paddingRight: 15}}>{QuizData[questions[currentQuestion]].question}</Text>
                  {options.map(option => (
                    <View style={{flex: 1, justifyContent: 'space-between'}}>
                        {option != userAnswer && 
                        <View style={{flex: 1}}>
                          <TouchableOpacity onPress={() => selectAnswerHandler(option)} key={option.id} style={{flex: 4, backgroundColor: 'white', borderWidth: 2, borderColor: 'black', borderRadius: '50%', marginLeft: 10, marginRight: 10}}>
                            <View style={{flex: 1}}></View>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                              <Text style={{textAlign: 'center', fontSize: 0.04 * screenWidth, fontWeight: 'bold', color: 'black'}}>{option}</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                          </TouchableOpacity>
                          <View style={{flex: 1}}></View>
                        </View>
                        }
                        {option === userAnswer &&
                         <View style={{flex: 1}}> 
                          <TouchableOpacity onPress={() => selectAnswerHandler(option)} key={option.id} style={[styles.selectedOption, {flex: 4, borderRadius: '50%'}]}>
                            <View style={{flex: 1}}></View>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                              <Text style={{textAlign: 'center', fontSize: 0.04 * screenWidth, fontWeight: 'bold', color: 'white'}}>{option}</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                          </TouchableOpacity>
                          <View style={{flex: 1}}></View>
                        </View>
                        }
                    </View>
                  ))}
              </View> 

                <View style={{flex: 1, marginBottom: 50, marginTop: 50}}>
                  <TouchableOpacity onPress={() => checkAnswerHandler()} style={{flex: 1, backgroundColor: '#0081d6', borderWidth: 2, borderColor: 'black', justifyContent: 'center', marginLeft: 10, marginRight: 10}}>
                    <View>
                      <Text style={{fontSize: 0.05 * screenWidth, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Check Answer</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              
            </View>
          }

          {(checkingAnswer && !quizIsFinished) &&
            <View style={{flex: 1, backgroundColor: 'white'}}>

              <View style={{flex: 11}}>
                <ScrollView>
                  <View style={styles.information}>
                  {(userAnswer === QuizData[questions[currentQuestion]].answer) &&
                    <View>
                      <Text style={styles.answerText}>Correct.{'\n'}</Text>
                      <View>
                        {information.map(info => (
                          <View>
                            <Text style={styles.boldedInformationText}>{info[0]}</Text>
                            <Text style={styles.informationText}>{info[1]}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  }
                  {(userAnswer != QuizData[questions[currentQuestion]].answer) &&
                    <View>
                      <Text style={styles.answerText}>Incorrect. The correct answer is '{QuizData[questions[currentQuestion]].answer}.'{'\n'}</Text>
                      <View>
                        {information.map(info => (
                          <View>
                            <Text style={styles.boldedInformationText}>{info[0]}</Text>
                            <Text style={styles.informationText}>{info[1]}</Text>
                          </View>
                        ))}
                      </View>

                    </View>
                  }
                  </View>
                </ScrollView>
              </View>

              {currentQuestion < questions.length - 1 &&                           
                <View style={{flex: 1, marginBottom: 50}}>
                  <TouchableOpacity onPress={() => nextQuestionHandler()} style={{flex: 1, backgroundColor: '#0081d6', borderWidth: 2, borderColor: 'black', justifyContent: 'center', marginLeft: 10, marginRight: 10}}>
                    <View>
                      <Text style={{fontSize: 0.05 * screenWidth, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Next Question</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              {(currentQuestion === questions.length - 1 && !quizIsFinished && checkingAnswer) &&
                <View style={{flex: 1, marginBottom: 50}}>
                  <TouchableOpacity onPress={() => finishHandler()} style={{flex: 1, backgroundColor: '#0081d6', borderWidth: 2, borderColor: 'black', justifyContent: 'center', marginLeft: 10, marginRight: 10}}>
                    <View>
                      <Text style={{fontSize: 0.05 * screenWidth, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Finish Quiz</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }

            </View>
          }

          {quizIsFinished &&
            <View style={styles.finalScoreContainer}>
              <Text style={styles.textFinal}>Quiz Over</Text>
              <Text style={styles.textFinal}>Final Score: {currentScore} / {questions.length}</Text>

              <View>
                <TouchableOpacity onPress={() => retakeQuizHandler()} style={styles.readDisclaimerButton}>
                  <View>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Retake Quiz</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
    {/* </LinearGradient> */}

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  heading: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 2
  },
  body: {
    flex: 9
  },
  selectedOption: {
    // backgroundColor: '#f5ea51',
    backgroundColor: '#ff9500',
    borderWidth: 2,
    borderColor: 'black',
    marginLeft: 10,
    marginRight: 10
  },
  answerText: {
    fontSize: 30,
    // color: '#1c9fa3',
    color: '#0081d6',
    fontWeight: 'bold'
  },
  finalScoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  retakeQuizButton: {
    backgroundColor: '#fff',
    marginVertical: 10,
    width: 200,
    height: 60,
    justifyContent: 'center', 
    marginTop: 50,
    borderColor: 'black',
    borderWidth: 2
  },
  textFinal: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold'
  },
  gradient: {
    flex: 1,
  },
  information: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginLeft: 20,
    marginRight: 20
  },
  informationText: {
    fontSize: 20
  },
  boldedInformationText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20
  },
  disclaimerText: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center'
  },
  readDisclaimerButton: {
    backgroundColor: '#0081d6',
    width: 350,
    height: 60,
    justifyContent: 'center', 
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 75
  },
  nextQuestionTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});

