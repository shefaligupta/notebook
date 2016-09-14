  // created a namespace
  var myNotebook = {};

  //array for adding more pages
  myNotebook.pages = [];

  //max number of pages supported
  myNotebook.maxpages = 5;

  myNotebook.currentPage = 1;

   myNotebook.book = document.getElementById('book');

  /* this function checks if localstorage exists
   * then check if notes exist in local storage
   * if doesnt exist then automatically add new page else get pages from local storage and displays them
   * notes are editable and autosaved when focus is removed from editable div
   * if localstorage is not supported then nothing happens
   */
  myNotebook.checkStorage = function() {
    if (window["localStorage"]) {
      if (localStorage.getItem('myNotebookData') != undefined) {
        myNotebook.pages = JSON.parse(localStorage
            .getItem('myNotebookData'));
        document.getElementById('next').style.display = 'block';
        for (var i = 0; i < myNotebook.pages.length; i++) {
          myNotebook.addtoBook(myNotebook.pages[i]);
        }
      }

      else {
        var page = myNotebook.createPageElement(1);
        page.style.display = 'block';
        document.getElementById('1').focus();        
      }
    } 

    else {
      alert('localStorage is not supported');
    }
  };

  /*
   * If notebookdata exist in local storage then get them from localstorage and append data to DOM
   */
  myNotebook.addtoBook = function(pageData) {
    var page = myNotebook.createPageElement(pageData.number);
    if (pageData.number == 1) {
      page.style.display = 'block'; // by default first page will be always visible
    } else {
      page.style.display = 'none';
    }
    page.innerHTML = pageData.content;
    myNotebook.book.appendChild(page);
  };

  /*
   * This function is called when you want to add new page to notes
   * checks if already 5 pages exist then doesn't allow adding more pages
   * automatically takes cursor to new page
   */
  myNotebook.newPage = function() {

    myNotebook.pages = JSON.parse(localStorage.getItem('myNotebookData'));
    if (myNotebook.pages.length == myNotebook.maxpages) {
      alert('cannot add more pages');
    } else {
      var page = myNotebook
          .createPageElement(myNotebook.pages.length + 1);
      
      myNotebook.setVisibility(page.id);

      var data = myNotebook.createPageObject(page.id, '');
      myNotebook.pages.push(data);
      localStorage.setItem('myNotebookData', JSON
          .stringify(myNotebook.pages));
    }
  };


  //set new page
  myNotebook.setVisibility = function(pageId) {
    
    myNotebook.currentPage = pageId;
    myNotebook.pages = JSON.parse(localStorage.getItem('myNotebookData'));

    var totalPages = myNotebook.pages.length;
    if(pageId == 1){
      document.getElementById('next').style.display = 'block';
      document.getElementById('previous').style.display = 'none';
    }

    else if(pageId>1 && pageId<totalPages){
     document.getElementById('next').style.display = 'block';
      document.getElementById('previous').style.display = 'block'; 
    }

    else{
     document.getElementById('next').style.display = 'none';
     document.getElementById('previous').style.display = 'block';  
    }

    for(var i=1;i<=totalPages;i++){
      if(i==pageId){
        document.getElementById(i).style.display = 'block';
      }
      else{
        document.getElementById(i).style.display = 'none';
      }
    }
  };


  //set prev/next page
  myNotebook.toggleSlide = function(action){

    if(action == 'next'){
        myNotebook.setVisibility(myNotebook.currentPage+1);
      }

    else if(action == 'prev'){
      myNotebook.setVisibility(myNotebook.currentPage-1);
    }
  };

  //create object to be added to mynotebook array
  myNotebook.createPageObject = function(id, content) {
    var data = {};
    data.number = id;
    data.content = content;

    return data;
  };

  //create new page element UI
  myNotebook.createPageElement = function(id) {
    var page = document.createElement('li');
    page.className = 'list';
    page.id = id;
    page.contentEditable = 'true';
    myNotebook.book.appendChild(page);
    document.getElementById(page.id).addEventListener("focusout",
           myNotebook.savePage, true);
    return page;
  };

  // Called to remove notes from localstorage for testing purpose, reloads page
  myNotebook.removeAll = function() {
    localStorage.removeItem('myNotebookData');
    location.reload();
  };

  /*
   * Saves content to localstorage for first time
   * updates notes when changes are made
   */
  myNotebook.savePage = function() {
    myNotebook.pages = [];
    var notebookContent = myNotebook.book.getElementsByTagName('li');
    console.log(notebookContent);
    for (var i = 0; i < notebookContent.length; i++) {
      temp = myNotebook.createPageObject(notebookContent[i].id,
          notebookContent[i].innerHTML);
      console.log(temp);
      myNotebook.pages.push(temp);
    }
    console.log(myNotebook.pages);
    localStorage
        .setItem('myNotebookData', JSON.stringify(myNotebook.pages));
    alert('Changes saved automatically');

  };

  // on domcontentload local storage is checked
  //if no data is found then a new page is added automatically by calling checkstorage function of myNotebook namespace
  document.addEventListener('DOMContentLoaded', myNotebook.checkStorage,false);