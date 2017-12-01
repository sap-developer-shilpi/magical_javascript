/* to add x to list items */
 function addX(){
   var myTaskList = document.getElementsByTagName("LI");

    for(var i = 0; i< myTaskList.length; i++){
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      myTaskList[i].appendChild(span);
    }
}

addX();

/* to close an element */

var close = document.getElementsByClassName('close');
for(var i = 0; i< close.length; i++){
  close[i].onclick = dynamicDelete;
}

function dynamicDelete(){
  var span = this.parentElement;
  console.log(span);
  span.style.display = "none";
};




/* to add an item to checked list */
function checkedLine(e){
  e.path[0].classList.toggle('checked');
}

var checkList = document.querySelector("UL");
console.log(checkList);
checkList.addEventListener('click', checkedLine);

/* add New task */

function newElement(){
  var newTask = document.createElement("LI");
  var newValue = document.getElementById("myInput").value;
  var newtxt = document.createTextNode(newValue);
  newTask.appendChild(newtxt);
  if(newValue === ''){
    alert("you must write something!")
  }
  else{
    document.getElementById("myList").appendChild(newTask);
  }
  document.getElementById("myInput").value="";
  addX();
  var closenew = document.getElementsByClassName('close');
   for(var i = 0; i< closenew.length; i++){
     closenew[i].onclick = dynamicDelete;
   }

}
