//global variables
let myLibrary = [];
let oneBook = new Book('the Death of Grass dfafaefaf aafwf  dff ', 'John Christopher', 194, true);
myLibrary.push(oneBook);

//function executions
render();
addEvents();

//function definitions here
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function() {
  return `${this.title} by ${this.author},
   ${this.pages} pages,
  ${this.read? "already read it": "not read yet"}`
}

function addBookToLibrary() {
  let title = document.forms[0][0].value;
  let author = document.forms[0][1].value;
  let pages = document.forms[0][2].value;
  let read = document.forms[0].elements['read'].value;
  read = read == "yes"? true: false;

  return new Book(title, author, pages, read);
}

function updateNewBook() {
  console.log('work');
  myLibrary.push(addBookToLibrary());
  document.forms[0].reset();
  render();
  checkFormCompletion();
}

function render() {
  let newTbody = document.createElement('tbody');
  let oldTbody = document.getElementById('table-body');
  newTbody.id = 'table-body';

  myLibrary.forEach(function (book){
    let row = document.createElement('tr');

    let removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-book');
    removeBtn.classList.add('btn');
    removeBtn.textContent = 'remove';

    removeBtn.addEventListener('click', function() {
      let listOfBooks = this.parentNode.parentNode.parentNode.children;
      let book =  this.parentNode.parentNode;
      let index = Array.prototype.indexOf.call(listOfBooks, book);
      myLibrary.splice(index, 1);
      render();
    })

    let td = document.createElement('td');
    td.appendChild(removeBtn)

    let bookProps = Object.entries(book);

    bookProps.forEach(el => {
      let value = document.createElement('td');
      value.textContent = el[1];

      if(el[1] === "yes" || el[1] === "no") {
        
      }
      row.appendChild(value);
      row.appendChild(td);
    })
    newTbody.appendChild(row);
  })

  document.getElementById('table-of-books').replaceChild(newTbody, oldTbody);
}

function checkFormCompletion() {
  let submitBtn = document.getElementById('submit-button');
  for(let i = 0; i < document.forms[0].length; i++) {
    if( !document.forms[0][i].checkValidity() ) {
      submitBtn.setAttribute("disabled","");
      break;
    }
    submitBtn.removeAttribute("disabled");
  }
}
function addEvents() {
  document.getElementById('submit-button').addEventListener('click', updateNewBook);
  document.getElementsByTagName('form')[0].addEventListener("change", checkFormCompletion);
}
