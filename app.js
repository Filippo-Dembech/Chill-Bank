
class User {
    
    #username;
    #password;
    #operations = [];
    #bankAccount;
    
    constructor(username, password, bankAccount = new BankAccount()) {
        this.#username = username;
        this.#password = password;
        this.#bankAccount = bankAccount;
    }

    /**
     * Executes an operation on the user bank account.
     * @param {Operation} operation - The operation to do on the user bank account.
     */
    makeOperation(operation) {
        operation.operateOn(this.#bankAccount);
        this.#operations.push(operation);
    }
    
    get username() { return this.#username; }
    get password() { return this.#password; }
    get operations() { return this.#operations; }
    get bankAccount() { return this.#bankAccount; }
    
}

class Operation {
    
    #amount;
    #dateTime;
    
    /**
     * Creates an operation that operates on the specified bank account.
     * @param {Number} amount - The amount of chill to operate on.
     */
    constructor(amount) {
        this.#amount = amount;
        this.#dateTime = this.getCurrentDateTime();
    }
    
    /**
     * Operate on the specified bank account.
     * @param {BankAccount} bankAccount - The bank account to operate on.
     */
    operateOn(bankAccount) {}
    getType() {}
    
    getCurrentDateTime() {
        const now = new Date();
        
        // Format options for date and time
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        
        // Format date
        const date = new Intl.DateTimeFormat('en-GB', dateOptions).format(now);
        
        // Format time
        const time = new Intl.DateTimeFormat('en-GB', timeOptions).format(now);
        
        return `${date}, ${time}`;
    }

    getHTML() {
        return `
            <div class="operation">
                <span class="type ${this.getType()}">${this.getType().toUpperCase()}</span>
                <span class="amount">${this.#amount} CHILL</span>
                <span class="date">${this.#dateTime}</span>
            </div>
        `
    }
    
    get amount() { return this.#amount; }
    set amount(amount) { this.#amount = amount; }
}


class Withdrawal extends Operation {

    constructor(amount) {
        super(amount);
    }
    
    /**
     * Withdraw chilld from the specified bank account.
     * @param {BankAccount} bankAccount - The bank account to withdraw chill from.
     */
    operateOn(bankAccount) {
        bankAccount.withdraw(this.amount);
    }
    
    getType() { return "withdrawal"; }

}

class Deposit extends Operation {

    constructor(amount) {
        super(amount);
    }
    
    /**
     * Deposits chill from the specified bank account.
     * @param {BankAccount} bankAccount - The bank account to deposit chill in.
     */
    operateOn(bankAccount) {
        bankAccount.deposit(this.amount);
    }
    
    getType() { return "deposit"; }

}

class Transfer extends Operation {
    
    #otherUser;

    constructor(amount, otherUser) {
        super(amount);
        this.#otherUser = otherUser;
    }
    
    /**
     * Deposits chill from the specified bank account.
     * @param {BankAccount} bankAccount - The bank account to deposit chill in.
     */
    operateOn(bankAccount) {
        bankAccount.withdraw(this.amount);
        this.#otherUser.makeOperation(new Deposit(this.amount));
    }
    
    getType() { return "transfer"; }

}

class BankAccount {

    #currentAmount;

    /**
     * Create a chill bank account with an initial amount of chill.
     * @param {Number} initialAmount - The amount of chill to start the bank account with (default is 0)
     */
    constructor(initialAmount = 0) {
        this.#currentAmount = initialAmount;
    }

    /**
     * Returns the current amount of chill stored in the bank account.
     */
    get currentAmount() { return this.#currentAmount; }
    
    /**
     * Deposits the specified amount of chill.
     * @param {Number} amount - The amount of chill to deposit
     */
    deposit(amount) { this.#currentAmount += amount; }

    /**
     * Withdraws certain amount of chill from the bank account.
     * @param {Number} amount - The amount of chill to withdraw
     */
    withdraw(amount) {
        if (this.#currentAmount > amount) {
            this.#currentAmount -= amount;
        }
        // understand what to do if there are no money
    }
    
    /**
     * Transfer a certain amount of chill from a user to another user.
     * @param {Number} amount - Amount of chill to transfer
     * @param {User} receiver - The user transfering the chill to
     */
    transfer(amount, receiver) {
        if (this.#currentAmount > amount) {
            this.#currentAmount -= amount;
            receiver.bankAccount.deposit(amount);
            receiver.makeOperation(new Deposit(amount));
        }
    }

}



const welcomePage = document.querySelector(".welcome-page");
const loginSection = document.querySelector(".welcome-page .login-section");
const loginSectionBackground = document.querySelector(".welcome-page .login-section .background");
const loginFormButtons = document.querySelectorAll(".welcome-page .login-form-button");
const loginCloseButton = document.querySelector(".welcome-page .login-section .close-button");
const formLoginButton = document.querySelector(".welcome-page .login-section .form .login-button");
const formUserNameField = document.querySelector(".welcome-page .login-section .form .username-field");
const formPasswordField = document.querySelector(".welcome-page .login-section .form .password-field");

const userPage = document.querySelector(".user-page");

loginFormButtons.forEach((button) => {
    button.addEventListener('click', () => {
        showLoginSection();
    });
});

loginSectionBackground.addEventListener('click', () => {
    hideLoginSection();
});

loginCloseButton.addEventListener('click', () => {
    hideLoginSection();
});

class OperationElement {
    
}


class ChillBankApp {
    
    #currentUser;
    
    /**
     * @type {User[]}
     */
    #users;

    constructor(users) {
        this.#users = users;
    }

    /**
     * Get the current user of the Chill Bank app.
     * @returns {User}
     */
    get currentUser() { return this.#currentUser; }
    set currentUser (newUser) { this.#currentUser = newUser; }
    
    getUserByName(name) {
        for (let user of this.#users) {
            if (user.username == name) {
                return user;
            }
        }
        return null;
    }
    
    showLoginForm() {
        loginSection.style.display = "flex";
        loginSection.style.visibility = "visible";
        loginSection.style.opacity = 1;
    }
    
    hideLoginForm() {
        loginSection.style.visibility = "hidden";
        loginSection.style.opacity = 0;
        loginSection.style.display = "none";
        formUserNameField.value = "";
        formPasswordField.value = "";
    }
    
    get users() { return this.#users; }

}

const filippo = new User("Filippo", "asdf", new BankAccount(500));
const lombard = new User("Lombard", "asdf", new BankAccount(500));

filippo.makeOperation(new Deposit(1000));
filippo.makeOperation(new Withdrawal(200));
filippo.makeOperation(new Transfer(200, lombard));

const chillBankApp = new ChillBankApp([
    new User("Wargrave", "asdf", new BankAccount(1000)),
    new User("Claythorne", "asdf", new BankAccount(200)),
    new User("Armstrong", "asdf", new BankAccount(600)),
    new User("Blore", "asdf", new BankAccount(700)),
    new User("Massimiliano", "asdf", new BankAccount(700)),
    lombard,
    filippo
]);

formLoginButton.addEventListener('click', () => {

    let insertedUserName = formUserNameField.value;
    let insertedPassword = formPasswordField.value;
    
    for (let user of chillBankApp.users) {
        if (user.username === insertedUserName && user.password === insertedPassword) {
            chillBankApp.currentUser = user;
            uploadCurrentUser();
        }
    }
    
});

const operationsList = document.querySelector(".user-page .body .operation-history-section .history-section")
const totalChillField = document.querySelector(".user-page .body .operation-history-section .statistics-section .total-section .amount");
const withdrawChillField = document.querySelector(".user-page .body .operation-history-section .statistics-section .withdraw-section .amount");
const depositChillField = document.querySelector(".user-page .body .operation-history-section .statistics-section .deposit-section .amount");
const transferChillField = document.querySelector(".user-page .body .operation-history-section .statistics-section .transfer-section .amount");

function uploadCurrentUser() {
    removeWelcomePage();
    hideLoginSection();
    showUserPage();
    uploadOperations();
    uploadStatistics();
    updateOperationsListOf(chillBankApp.currentUser);
}

function updateOperationsListOf(user) {

    operationsList.innerHTML = "";
    
    let totalChillAmount = 0;
    let withdrawChillAmount = 0;
    let depositChillAmount = 0;
    let transferChillAmount = 0;

    for (let operation of user.operations) {
        operationsList.insertAdjacentHTML('beforeend', operation.getHTML())
        if (operation.getType() === "withdrawal") {
            withdrawChillAmount += Number(operation.amount);
            totalChillAmount -= Number(operation.amount);
        };
        if (operation.getType() === "deposit") {
            depositChillAmount += Number(operation.amount);
            totalChillAmount += Number(operation.amount);
        }
        if (operation.getType() === "transfer") {
            transferChillAmount += Number(operation.amount);
            totalChillAmount -= Number(operation.amount);
        }
    }
    
    totalChillField.textContent = totalChillAmount;
    depositChillField.textContent = depositChillAmount;
    withdrawChillField.textContent = withdrawChillAmount;
    transferChillField.textContent = transferChillAmount;

}

function showLoginSection() {
    loginSection.style.display = "flex";
    loginSection.style.visibility = "visible";
    loginSection.style.opacity = 1;
}

function hideLoginSection() {
    loginSection.style.visibility = "hidden";
    loginSection.style.opacity = 0;
    loginSection.style.display = "none";
    formUserNameField.value = "";
    formPasswordField.value = "";
}

function removeWelcomePage() {
    welcomePage.style.display = "none";
}

function showWelcomePage() {
    welcomePage.style.display = "block";
}

function showUserPage() {
    userPage.style.display = "flex";
    const userPageNavbarUsername = document.querySelector(".user-page .navbar .username");
    userPageNavbarUsername.textContent = `Hi, ${chillBankApp.currentUser.username}!`;
}

function removeUserPage() {
    userPage.style.display = "none";
}

function uploadOperations() {
    
}

function uploadStatistics() {

}

const userPageLogoutButton = document.querySelector(".user-page .navbar .logout-button")
const userPageLogoutSection = document.querySelector(".user-page .logout-section");
const userPageLogoutSectionYesButton = document.querySelector(".user-page .logout-section .yes");
const userPageLogoutSectionNoButton = document.querySelector(".user-page .logout-section .no");

function showLogoutSection() {
    userPageLogoutSection.style.display = "flex";
    userPageLogoutSection.style.opacity = 1;
}

function hideLogoutSection() {
    userPageLogoutSection.style.display = "none";
    userPageLogoutSection.style.opacity = 0;
}

userPageLogoutButton.addEventListener('click', () => {
    showLogoutSection();
})

userPageLogoutSectionYesButton.addEventListener('click', () => {
    removeUserPage();
    showWelcomePage();
    hideLogoutSection();
})

userPageLogoutSectionNoButton.addEventListener('click', () => {
    hideLogoutSection();
})

const withdrawButton = document.querySelector(".user-page .body .operations-section .withdrawal-section button");
const withdrawField = document.querySelector(".user-page .body .operations-section .withdrawal-section .field");

withdrawButton.addEventListener('click', () => {
    const withdrawAmount = withdrawField.value;
    if (withdrawAmount == 0) {
        showPopup("Withdraw amount not inserted.", 1500);
    } else {
        chillBankApp.currentUser.makeOperation(new Withdrawal(withdrawAmount));
        updateOperationsListOf(chillBankApp.currentUser);
        withdrawField.value = null;
    }
});

const depositButton = document.querySelector(".user-page .body .operations-section .deposit-section button");
const depositField = document.querySelector(".user-page .body .operations-section .deposit-section .field");

depositButton.addEventListener('click', () => {
    const depositAmount = depositField.value;
    if (depositAmount == 0) {
        showPopup("Deposit amount not inserted.", 1500)
    } else {
        chillBankApp.currentUser.makeOperation(new Deposit(depositAmount));
        updateOperationsListOf(chillBankApp.currentUser);
        depositField.value = null;
    }
});

const transferButton = document.querySelector(".user-page .body .operations-section .transfer-section button");
const transferAmountField = document.querySelector(".user-page .body .operations-section .transfer-section .field-amount");
const transferReceiverField = document.querySelector(".user-page .body .operations-section .transfer-section .field-receiver");

transferButton.addEventListener('click', () => {
    const insertedUserName = transferReceiverField.value;
    const receiver = chillBankApp.getUserByName(insertedUserName);
    if (receiver === null) {
        showPopup("Receiver Error: User not found.", 1500)
    } else {
        chillBankApp.currentUser.makeOperation(new Transfer(transferAmountField.value, receiver));
        updateOperationsListOf(chillBankApp.currentUser);
        transferAmountField.value = null;
        transferReceiverField.value = null;
    }
        
});

function showPopup(message, duration) {
    // Create a div element for the popup
    const popup = document.createElement("div");
    
    // Set popup content and basic styles
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    popup.style.color = "#fff";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "5px";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    popup.style.zIndex = "1000";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.fontSize = "16px";
    popup.style.opacity = "0";
    popup.style.transition = "opacity 0.3s ease";

    // Append the popup to the body
    document.body.appendChild(popup);

    // Show the popup with fade-in effect
    setTimeout(() => {
        popup.style.opacity = "1";
    }, 10);

    // Hide and remove the popup after the specified duration
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300); // Wait for the fade-out transition to finish
    }, duration);
}
