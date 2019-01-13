//global variables
let myLibrary = [];

if (storageAvailable('localStorage')) {
  if (localStorage.getItem('myLibrary')) {
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  }
} else {
  alert("localStorage service is not available");
}

//function executions
render();
addEvents();

//class definitions here
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.read = read;
  }
  info() {
    return `${this.title} by ${this.author},
     ${this.pages} pages,
    ${this.read? "already read it": "not read yet"}`
  }
  toggleRead() {
    this.read = !this.read;
  }
}

//function definitions here
function addBookToLibrary() {
  let title = document.forms[0][0].value;
  let author = document.forms[0][1].value;
  let pages = document.forms[0][2].value;
  let read = document.forms[0].elements['read'].value;
  read = read == "yes" ? true : false;

  return new Book(title, author, pages, read);
}

function updateNewBook() {
  myLibrary.push(addBookToLibrary());
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  document.forms[0].reset();
  render();
  checkFormCompletion();
}

function render() {
  let newTbody = document.createElement('tbody');
  let oldTbody = document.getElementById('table-body');
  newTbody.id = 'table-body';

  myLibrary.forEach(function (book, index) {
    let row = document.createElement('tr');

    let removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-book');
    removeBtn.classList.add('btn');
    removeBtn.textContent = 'remove';

    removeBtn.addEventListener('click', function () {
      myLibrary.splice(index, 1);
      render();
    })

    let td = document.createElement('td');
    td.appendChild(removeBtn)

    let bookProps = Object.entries(book);

    bookProps.forEach(function (el) {
      let value = document.createElement('td');
      value.textContent = el[1];
      if (typeof el[1] === "boolean") {
        value.addEventListener('click', function () {
          myLibrary[index].toggleRead();
          render();
        })
        value.textContent = el[1] ? "yes" : "not yet";
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
  for (let i = 0; i < document.forms[0].length; i++) {
    if (!document.forms[0][i].checkValidity()) {
      submitBtn.setAttribute("disabled", "");
      break;
    }
    submitBtn.removeAttribute("disabled");
  }
}

function addEvents() {
  document.getElementById('submit-button').addEventListener('click', updateNewBook);
  document.getElementsByTagName('form')[0].addEventListener("change", checkFormCompletion);
}

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}
