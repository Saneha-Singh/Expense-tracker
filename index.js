const desc = document.getElementById("desc");
const amm = document.getElementById("amount");
const type = document.getElementById("type");
const transactionForm = document.querySelector(".transaction-form");
const transactionList = document.querySelector(".transaction-list");
const submitBtn = document.getElementById("submit-btn");

const totalIncome = document.getElementById("income");
const totalExpense = document.getElementById("expense");
const balance = document.getElementById("balance");

const filter = document.getElementById("filter");
const errorMessage = document.getElementById("error-message");

let transactions=[];
let editIndex = null;


function renderTransaction(){
  
    transactionList.innerHTML = "";
    transactions.forEach((transaction,index)=>{

        const li = document.createElement("li");
        const descSpan = document.createElement("span");
        const amountSpan = document.createElement("span");
        const delbtn = document.createElement("button");
        const editbtn = document.createElement("button");

        descSpan.textContent = transaction.description;
        
        if(transaction.type === "income"){
            amountSpan.textContent = `+${(Number(transaction.amount)).toLocaleString("en-IN")}`;
        }else{
            amountSpan.textContent = `-${(Number(transaction.amount)).toLocaleString("en-IN")}`;
        }

        // delbtn.textContent="Delete";
        delbtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        delbtn.classList.add("delbtn");

        editbtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editbtn.classList.add("editbtn");

        li.classList.add("transaction",transaction.type);

        

        delbtn.addEventListener("click", () => {
        transactions.splice(index, 1);
        // transactionList.removeChild(li);
        saveTransactions();
        renderTransaction();
        });
        li.append(descSpan,amountSpan,editbtn,delbtn);
        transactionList.appendChild(li);


        editbtn.addEventListener("click", ()=>{
            desc.value = transaction.description;
            amm.value = transaction.amount;
            type.value = transaction.type;

            editIndex = index;
            submitBtn.textContent = "Update";


        })
        submitBtn.textContent="Add";
    });
    updateTotals();
    desc.value = "";
    amm.value = "";


}

function updateTotals(){
    let income = 0 ;
    let expense = 0;
    transactions.forEach((transaction)=>{
        if(transaction.type === "income"){
            income += Number(transaction.amount);
        }
        else{
            expense += Number(transaction.amount);
        }
    })
    totalIncome.textContent = `₹${income.toLocaleString("en-IN")}`;
    totalExpense.textContent = `₹${expense.toLocaleString("en-IN")}`;
   
    balance.textContent = `₹${(income-expense).toLocaleString("en-IN")}`;
}

filter.addEventListener("change", filterTransactions);
function filterTransactions() {

    const selected = filter.value;

    const transactions = document.querySelectorAll(".transaction");

    transactions.forEach((transaction) => {

        if (selected === "all") {
            transaction.style.display = "grid";
        }

        else if (transaction.classList.contains(selected)) {
            transaction.style.display = "grid";
        }

        else {
            transaction.style.display = "none";
        }

    });

}

transactionForm.addEventListener("submit",event=>{
    event.preventDefault();

    const description = desc.value ;
    const amount = amm.value;
    const transactionType = type.value;


    desc.addEventListener("input", () => {
        desc.classList.remove("invalid");
    });

    amm.addEventListener("input", () => {
        amm.classList.remove("invalid");
    });

    let hasError = false;

    if(description.trim()=== ""){
       
        desc.classList.add("invalid");
        hasError=true;
        
    }
    if(amount === "" || Number(amount)<=0){
        
        amm.classList.add("invalid");
        hasError=true;
        
    }
    if(hasError){
        errorMessage.textContent = "Please fill in all fields correctly.";
        return;
    }


    errorMessage.textContent = "";


    const transaction = {
        description:description,
        amount:amount,
        type:transactionType
    }

    if (editIndex === null) {
        // Add new transaction
        transactions.push(transaction);
    } else {
        // Update existing transaction
        transactions[editIndex] = transaction;

        editIndex = null;
        submitBtn.textContent = "Add";
    }

    saveTransactions();
    renderTransaction();
    filterTransactions();
})

function saveTransactions(){
    localStorage.setItem("transactions",JSON.stringify(transactions));
}

const storedTransactions = localStorage.getItem("transactions");
if(storedTransactions){
    transactions = JSON.parse(storedTransactions);
    renderTransaction();
}