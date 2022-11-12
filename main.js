
const itemCtrl = (function(){
    const Item = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }

    const data = {
        items:[]
    }

    return{

        addTransaction: function(description, amount){

            let ID = Math.floor(Math.random()*10000);
            newTransaction = new Item(ID, description, amount);
            data.items.push(newTransaction);

            return newTransaction;
        },
        getIdNumber: function(item){
            //get the id of current item
            const amountId = (item.parentElement.id);// item-xxxx
            const itemArr = amountId.split('-');// ["item", "xxxx"]
            const id = parseInt(itemArr[1]);

            return id;
        },

        deleteAmountArr: function(id){
            //search through all the items and delete the item with matching id
            const ids = data.items.map(function(item){
                return item.id
            });
            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        }
    }
})();

const UICtrl = (function(){

    const UISelectors = {
        incomeBtn: '#add__income',
        expenseBtn: '#add__expense',
        description: '#description',
        amount: '#amount',
        moneyEarned: '#amount__earned',
        moneyAvailable: '#amount__available',
        moneySpent: '#amount__spent',
        incomeList: '#income__container',
        expensesList: '#expenses__container',
        incomeItem: '.income__amount',
        expenseItem: '.expense__amount',
        itemsContainer: '.items__container'
    }

    return{

        getSelectors: function(){
            return UISelectors
        },
        getDescriptionInput: function(){
            return {
                descriptionInput: document.querySelector(UISelectors.description).value
            }
        },
        getValueInput: function(){
            return{
                amountInput: document.querySelector(UISelectors.amount).value
            }
        },
        addIncomeItem: function(item){

            //create a new div and add all the classes, ids and insert required html for the income item
            const div = document.createElement('div');
            div.classList = 'item income'
            div.id = `item-${item.id}`
            div.innerHTML = `
            <h6>${item.description}</h6>
            <div class="item__income">
                <p class="symbol">₹</p>
                <span class="income__amount">${item.amount}</span>
            </div>
            <i class="far fa-regular fa-trash-can"></i>
            `;
            //insert income into the list
            document.querySelector(UISelectors.incomeList).insertAdjacentElement('beforeend', div);
        },
        clearInputs: function(){
            document.querySelector(UISelectors.description).value = ''
            document.querySelector(UISelectors.amount).value = ''
        },
        updateEarned: function(){
            //get all the income items, collect their income values thru the innerHTML and accumulate total income
            const allIncome = document.querySelectorAll(UISelectors.incomeItem);
            const incomeCount = [...allIncome].map(item => +item.innerHTML);
            const incomeSum = incomeCount.reduce((prevVal, currVal)=> prevVal + currVal,0);
            //display the total income in the earnings field
            document.querySelector(UISelectors.moneyEarned).innerHTML = Math.round(incomeSum);
        },
        addExpenseItem: function(item){
            //create a new div and add all the classes, ids and insert required html for the expense item
            const div = document.createElement('div');
            div.classList = 'item expense'
            div.id = `item-${item.id}`
            div.innerHTML = `
            <h6>${item.description}</h6>
            <div class="item__expense">
                <p class="symbol">₹</p>
                <span class="expense__amount">${item.amount}</span>
            </div>
            <i class="far fa-regular fa-trash-can"></i>
            `;
            //insert expense into the list
            document.querySelector(UISelectors.expensesList).insertAdjacentElement('beforeend', div);
        },
        updateSpent: function(){
            //get all the expense items, collect their expense values thru the innerHTML and accumulate total expense
            const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
            const expenseCount = [...allExpenses].map(item => +item.innerHTML)
            const expenseSum = expenseCount.reduce((prevVal, currVal) => prevVal + currVal, 0);
            // display the total expenses in the spent field
            document.querySelector(UISelectors.moneySpent).innerHTML = expenseSum;
        },
        updateAvailable: function(){
            const earnedAmount = document.querySelector(UISelectors.moneyEarned).innerHTML;
            const spentAmount = document.querySelector(UISelectors.moneySpent).innerHTML;
            const available = document.querySelector(UISelectors.moneyAvailable);
            //Display the current available balance 
            available.innerHTML = Math.round(((+earnedAmount)-(+spentAmount)));
        },
        deleteAmount: function(id){
            //concatenate it with the 'item-' to make our custom id, then get hold of the element with that ID and remove it from the doc
            const amountId = `#item-${id}`;
            const amountDelete = document.querySelector(amountId);
            amountDelete.remove();
        }
    }
})();


const App = (function(){

    const loadEventListeners = function(){

        const UISelectors = UICtrl.getSelectors();

        // adding event listeners to all the buttons
        document.querySelector(UISelectors.incomeBtn).addEventListener('click', addIncome);
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        document.querySelector(UISelectors.itemsContainer).addEventListener('click', deleteItem);
    }

    const addIncome = function(){
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        
        // check if the inputs are empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){

            const newEarnings = itemCtrl.addTransaction(description.descriptionInput, amount.amountInput);
            UICtrl.addIncomeItem(newEarnings);
            UICtrl.clearInputs();
            UICtrl.updateEarned();
            UICtrl.updateAvailable();
        }
    }

    const addExpense = function(){
 
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //check if inputs are empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){

            const newExpenses = itemCtrl.addTransaction(description.descriptionInput, amount.amountInput);
            UICtrl.addExpenseItem(newExpenses);
            UICtrl.clearInputs();
            UICtrl.updateSpent();
            UICtrl.updateAvailable();
        }
    }

    const deleteItem = function(e){
        console.log(e);
        console.log(e.target);
        if(e.target.classList.contains('far')){
            //get the current element's id number through its parent element
            const id = itemCtrl.getIdNumber(e.target);
            UICtrl.deleteAmount(id);
            itemCtrl.deleteAmountArr(id);
            UICtrl.updateEarned();
            UICtrl.updateSpent();
            UICtrl.updateAvailable();
        }

        e.preventDefault()
    }

    return{
        init: function(){
            loadEventListeners();
        }
    }

})(itemCtrl, UICtrl);

App.init();