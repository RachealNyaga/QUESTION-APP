import { useState } from 'react';
import './App.css';
import {admins} from './components/users.js'

function App() {
  let [reRender, setreRender] = useState(false);
  let [questions, setQuestions] = useState([]);
  let [loggedInUser, setloggedInUser] = useState(JSON.parse(sessionStorage.getItem("loggedin")));

  // Login
  function login() {
    let username = prompt("Enter username");
    let password = prompt("Enter password");

    admins.forEach(function(admin) {
      if(admin.username === username && admin.password === password) {
        sessionStorage.setItem("loggedin", JSON.stringify({admin: username, password: password}));
        alert("Logged in as " + admin.username);
        
        return;
      }
    })
    setloggedInUser(JSON.parse(sessionStorage.getItem("loggedin")));

    if(! sessionStorage.getItem("loggedin")) alert("Could not log you in as " + username);


    setreRender(!reRender);
  }
   // Logout
   function logout() {
    sessionStorage.removeItem("loggedin");
    setloggedInUser(null); // remove user from sessionstorage
    alert("Logged out")
   }

  // Add a new question
  function addQuestion() {

    let newQuestionTitle = prompt("Add a new question");
    let newQuestion = { // create a question object
      id: Math.ceil(Math.random() * 10000),
      title: newQuestionTitle,
      answer: "",
      author: loggedInUser.admin
    }

    setQuestions([...questions, newQuestion]) // add a new question to state
  }

  //  Answer a question - use id to identify the question
  function answerQuestion(id) {
    let questionsArray = questions;

    questionsArray.forEach(function(question) {
      if(question.id === id) {
        question.answer = prompt("Enter the answer");
      }
    })

    setreRender(!reRender);
  }

  // Edit question
  function editQuestion(id) {
    questions.forEach(function(question) {
      if(question.id === id) {
        question.title = prompt("Edit question", question.title); // javascript alert - takes 2 parameters - prompt("Message", "default-value")
      }
    })

    setreRender(!reRender); 
  }

  // Delete question
  function deleteQuestion(id) {

    questions.forEach(function(question, index) {
      if(question.id === id) {
        if(question.author === loggedInUser.admin) {
          questions.splice(index, 1);

          return;
        } else {
          alert("Only admin can delete the question");
          
          return;          
        }
      }
    })

    setQuestions(questions);
    setreRender(!reRender); 
  }

  return (
    <div className="App">
      <header>
        {loggedInUser ? <button className='btn delete-btn' onClick={logout}>LogOut</button> : <button className='btn' onClick={login}>Login</button>}

      </header>
      {loggedInUser ? <button className='btn' onClick={addQuestion}>Add question</button> : ""} {/** Show add question user only if we are logged in */}

      {questions.map(function(question) {
        return <div className='question' key={question.id}>
                <strong>Q: {question.title}</strong>
                <p>ANS: {question.answer}</p>
                {question.answer === "" ? <button className='btn' onClick={() => answerQuestion(question.id)}>Answer</button> : ""} {/** If question is not answered then show this button */}
                <button className='btn' onClick={() => editQuestion(question.id)}>Edit</button>
                <button className='btn delete-btn' onClick={() => deleteQuestion(question.id)}>Delete</button>
              </div>
      })}

    </div>
  );
}

export default App;
