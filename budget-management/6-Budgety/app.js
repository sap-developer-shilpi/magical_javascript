var budgetController = (function(){
  var Expense = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome > 0){
    this.percentage = Math.round((this.value / totalIncome)*100);
    } else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  var Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotals = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum+= cur.value;
    });
    data.totals[type]= sum ;
  };

  var data = {
        allItems: {
          exp: [],
          inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        },
        budget: 0,
        percentage: -1 // its better to use -1
      };

    return {
          addItem: function(type,desc,val){
            var newItem, ID;
            //create new unique id for every item added in exp or inc using the lastelements.id + 1
            //this is used because in future we may be deleting some elements
                if (data.allItems[type].length > 0 ){
                  ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                } else {
                  ID = 0;
                }

                //creating new item based on type that can be inc or exp
                if (type==='exp'){
                  newItem = new Expense(ID,desc,val);
                } else if (type === 'inc'){
                  newItem = new Income(ID,desc,val);
                }
            // adding item to particuler aarry inc or exp( push it into our datastructure exp or inc)
              data.allItems[type].push(newItem);
              // return the new item added
              return newItem;
           },

           deleteItem: function(type,id){
             var ids, index;
             //id = 6
             //data.allItems[type][id] we cannot use this because someitems may be deleted
             //ids = [1,2,4,6,8]
             //index = 3
            //map  is not called for missing elements of the array (that is, indexes that have never been set, which have been deleted or which have never been assigned a value).
              ids = data.allItems[type].map(function(current){
                return current.id
              });
              index = ids.indexOf(id);
               if (index !== -1){
                 data.allItems[type].splice(index,1);
                 //The splice() method changes the contents of an array by removing existing elements and/or adding new elements.
                 /*var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
                  myFish.splice(2, 0, 'drum'); // insert 'drum' at 2-index position
                  // myFish is ["angel", "clown", "drum", "mandarin", "sturgeon"]

                  myFish.splice(2, 1); // remove 1 item at 2-index position (that is, "drum")
                  // myFish is ["angel", "clown", "mandarin", "sturgeon"]
                  */
               }
            },

           calculateBudget: function(){
             //1. calculate the total income and expenses
             calculateTotals('exp');
             calculateTotals('inc');
             //2. calculate the budget(income - expenses)
             data.budget = data.totals.inc - data.totals.exp;
             //3. calculate the pecentage of income that we spent
             if (data.totals.inc>0 && data.budget >= 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100) ;
             } else {
               data.percentage = -1;
             }

           },

           calculatePercentages: function(){
             data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.totals.inc)
             });
           },

           getPercentages: function(){
             var allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage(); // this is the method of object Expenes on the top not this current function see the difference of s at the end
             });
             return allPerc;
           },

           getBudget: function(){
             return{
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
             };
           },

           testing: function(){
             console.log(data);
           }
       };

})();

var UIController = (function(){

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num,type){
      var numSplit, int , dec
      num = Math.abs(num); // returns absolute value of string i.e. + or - removed from front of a number
      num = num.toFixed(2); // returns number with 2 decimal points e.g. 2000 = 2000.00 or 23.78049 = 23.79
      numSplit = num.split('.'); // it is a string now not number so we csn use split method over it
      int = numSplit[0];
      if (int.length > 3){
        int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);
      }
      dec = numSplit[1];
      return (type === 'exp'? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback){  // here callback function relates to function(current,index)
      for(var i = 0; i < list.length ; i++){
        callback(list[i],i);
      }
    };

    return{
          getInput: function(){
                return{
                 type: document.querySelector(DOMstrings.inputType).value, // will be either inc(income) or exp (expenses)
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
              };
            },

            addListItem: function(obj,type){
              var html, newHtml, element;
              //create HTML string with placeholder text
                if (type === 'inc'){
                  element = DOMstrings.incomeContainer;
                  html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                  } else if (type ==='exp'){
                    element = DOMstrings.expensesContainer;
                  html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                  }
                  newHtml = html.replace('%id%', obj.id);
                  newHtml = newHtml.replace('%description%', obj.description);
                  newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            //replace the place holedr with actual data
              //Insert HTML into DOM
              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            },
            deleteListItem: function(seletorID){
              var el = document.getElementById(seletorID);
              el.parentNode.removeChild(el);
              },

            clearFields: function(){
              var fields, fieldsArr;
              // the querySelectorAll method always returns a list not array so we cannt loop over it
              // that is why we need to covert it to an array
              fields = document.querySelectorAll(DOMstrings.inputDescription+ ','+ DOMstrings.inputValue);
              // here we use the slice method associated with Array prototype(class) to convert a list(fields) into array
              fieldsArr = Array.prototype.slice.call(fields);
              // foreach function always take these three args its syntax
              fieldsArr.forEach(function(current,index,array){
                current.value = "";
              });
              fieldsArr[0].focus();
            },

            displayBudget: function(obj){
              var type;
              obj.budget >= 0 ? type = 'inc' : type = 'exp';
             document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
             document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
             document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
             if (obj.percentage > 0){
             document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ '%';
              } else{
             document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
           },

           displayPercentages: function(percentages){
             var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
              // here the queryselector returns a list(nodeList) of items.
             nodeListForEach(fields ,function(current,index){
               if (percentages[index] > 0){
                 current.textContent = percentages[index] + '%';
               }else {
                 current.textContent = '---';
               }

             });
           },
           displayDate: function(){
             var now, year, curMonth, months;
              months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              now = new Date();
              year = now.getFullYear();
              month = months[now.getMonth()];
              document.querySelector(DOMstrings.dateLabel).textContent = month+ ' ' + year;
           },
           // function to change the color of border of description,value and button to red when we are adding expenses
           changedType: function(){
             var fields = document.querySelectorAll(
               DOMstrings.inputType + ',' +
               DOMstrings.inputDescription + ',' +
               DOMstrings.inputValue);

              nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
              });
              document.querySelector(DOMstrings.inputBtn).classList.toggle('red');  
           },

           getDOMstring: function(){
             return DOMstrings;
           }
       }

})();

handlers/messages.php?action=sendMessage&message='+message,function(response){
var controller = (function(budgetCtrl, UICtrl){
   // event handler function
      var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem );

        document.addEventListener('keypress', function(event){
          if(event.keyCode ===13){
           ctrlAddItem();
          }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        // event delegation functionality is used in the eventlistener

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
      };
      // dealing with budget function
      var updateBudget = function(){
        // 1. calculate budget
        budgetCtrl.calculateBudget();
        // 2. return budget
        var budget = budgetCtrl.getBudget();
        // 3. display budget to UI
        UICtrl.displayBudget(budget);
      }

      var updatePercentages = function(){
        // 1. calculate the percentages
         budgetCtrl.calculatePercentages();
        //2. read the percentages from budgetCtrl
        var percentages = budgetCtrl.getPercentages();
        //3. update the percentages in UI
        UICtrl.displayPercentages(percentages);
      };

      // add items to income and expense fuction
      var ctrlAddItem = function(){
        var input, newItem;
         // 1. get the field input data
          input = UICtrl.getInput();

          if (input.description !== "" && !isNaN(input.value) && input.value >0 ){
            // 2. add item to the budget controller
             newItem = budgetCtrl.addItem(input.type, input.description, input.value);
           // 3. adding the item to UI
             UICtrl.addListItem(newItem, input.type);
          // 4. clear the fields
             UICtrl.clearFields();
          // 5. calculate and update budget
            updateBudget();
          // 6. calculate and update the percentages
           updatePercentages();
          }

      };

   //delete items from income or expenses
    var ctrlDeleteItem = function(event){
      var itemID, splitID, type, ID;
      itemID = (event.target.parentNode.parentNode.parentNode.id);
      if (itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        // delete the item from data structure
         budgetCtrl.deleteItem(type,ID);
        //delete the item from UI
         UICtrl.deleteListItem(itemID);
        //update and show the new budget, income Total and expenses total
        updateBudget();
        // update the percentages after deletion of any income or expenses
        updatePercentages();
      }
    };

  return{
    init: function(){
      console.log('application started');
        UICtrl.displayDate();
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: 0
        });
      setupEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();
