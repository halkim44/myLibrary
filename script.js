//global variables
let myLibrary = [{
    title: "Colorless Tsukuru Tazaki and His Years of Pilgrimage",
    author: "Haruki Murakami",
    pages: "370",
    read: false
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R Tolkien",
    pages: "1323",
    read: false
  }
];

if (storageAvailable()) {
  // replace data template with stored useData

  myLibrary = JSON.parse(localStorage.getItem('my-library')) || myLibrary;
}

var modal = document.querySelector(".modal");
var trigger = document.querySelector(".show-form-btn");
var closeBtn = document.querySelector(".close-button");

//function executions
render();
addEvents();
update();

//classes
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  info() {
    return `${this.title} by ${this.author},
     ${this.pages} pages,
    ${this.read? "already read it": "not read yet"}`
  }
}
//function definitions here
function storageAvailable() {
  try {
      var storage = window['localStorage'],
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
function update() {
  localStorage.setItem('my-library', JSON.stringify(myLibrary));
}
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
  document.forms[0].reset();
  render();
  update();
  toggleModal();
}

function render() {
  let table = document.querySelector('table')
  table.style.display = '';

  if (myLibrary.length == 0) {
    table.style.display = 'none';
    return;
  }
  let newTbody = document.createElement('tbody');
  let oldTbody = document.getElementById('table-body');
  newTbody.id = 'table-body';

  myLibrary.forEach(function (book, i) {
    let row = document.createElement('tr');

    let removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-book');
    removeBtn.classList.add('btn');
    removeBtn.textContent = 'remove';

    removeBtn.addEventListener('click', function () {
      myLibrary.splice(i, 1);
      update();
      render();
    })


    let removeBtnCell = document.createElement('td');
    removeBtnCell.appendChild(removeBtn)

    let bookProps = Object.entries(book);
    console.log(book);

    bookProps.forEach(el => {
      let tableData = document.createElement('td');

      if( el[0] == 'read') {
        let readToggler = document.createElement('button');
        console.log(readToggler);
        if(el[1]) {
          readToggler.textContent = 'read';
          readToggler.classList.remove('not-yet');
          readToggler.classList.add('read');
        } else {
          readToggler.textContent = 'not yet';
          readToggler.classList.remove('read');
          readToggler.classList.add('not-yet');
        }

        readToggler.addEventListener('click', function() {
          myLibrary[i].read = !myLibrary[i].read;
          update();
          render();
        })
        tableData.appendChild(readToggler);
      }else {
      tableData.textContent = el[1];
      }

      row.appendChild(tableData);

    })
    row.appendChild(removeBtnCell);
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

function toggleModal() {
  modal.classList.toggle('show-modal');
}
function windowOnClick(event) {
  if(event.target === modal) {
    toggleModal()
  }
}

trigger.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
checkFormCompletion();
