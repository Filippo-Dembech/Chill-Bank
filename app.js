
/**
 * A user for the {@link ChillBankApp}.
 */
class User {
    
    /**
     * The name of the user
     * @type {String}
     */
    #username;
    
    /**
     * The password associated to the user to access.
     * @type {String}
     */
    #password;
    
    /**
     * The list of all the operations the user has made.
     * @type {Operation[]}
     * @see {@link Operation}
     */
    #operations = [];
    
    /**
     * The bank account associated with the user.
     * @type {BankAccount} [new BankAccount()]
     */
    #bankAccount = new BankAccount();
    
    /**
     * Creates a new {@link User} for the {@link ChillBankApp}
     * @param {String} username - The username of the user
     * @param {String} password - The password associated with the user account
     * @param {BankAccount} [bankAccount] - The {@link BankAccount} associated with the user.
     * @see {@link BankAccount}
     */
    constructor(username, password, bankAccount) {
        this.#username = username;
        this.#password = password;
        this.#bankAccount = bankAccount;
    }

    /**
     * Executes an operation on the user bank account.
     * @param {Operation} operation - The {@link Operation} to do on the user {@link BankAccount}.
     */
    makeOperation(operation) {
        console.log("inside User.makeOperation()");
        operation.operateOn(this.#bankAccount);
        this.#operations.push(operation);
        console.log("operation " + operation.getType() + " has been added to the operations list");
    }
    
    /**
     * Returns the username of the {@link User}.
     */
    get username() { return this.#username; }

    /**
     * Returns the password of the {@link User}.
     */
    get password() { return this.#password; }

    /**
     * Returns the list of operations of the {@link User}.
     * @see {@link Operation}
     */
    get operations() { return this.#operations; }

    /**
     * Returns the {@link BankAccount} associated with the {@link User}
     */
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

class ChillBankApp {
    
    /**
     * @type {User}
     */
    #currentUser;
    
    /**
     * @type {User[]}
     */
    #users;
    
    /**
     * @type {WelcomePage}
     */
    #welcomePage;
    
    /**
     * @type {UserPage}
     */
    #userPage;

    constructor(users) {
        this.#users = users;
        this.#welcomePage = new WelcomePage(".welcome-page");
        this.#userPage = new UserPage(".user-page");
        this.#welcomePage.onLogin(() => {

            console.log("inside chillBankApp.onLogin() callback")

            let insertedUserName = this.#welcomePage.loginForm.username;
            let insertedPassword = this.#welcomePage.loginForm.password;
            
            for (let user of this.users) {
                if (user.username === insertedUserName && user.password === insertedPassword) {
                    console.log("user has been found")
                    this.#currentUser = user;
                    this.#userPage.user = this.#currentUser;
                    this.#welcomePage.hideGUI();
                    this.uploadCurrentUser();
                }
            }
        })

        this.#userPage.atLogoutButtonClick((userPage) => {
            console.log("inside chillBankApp.atLogoutButtonClick() callback");
            userPage.showLogoutModal((modal) => {
                console.log("inside chillBankApp.showLogoutModal() callback");
                userPage.hideGUI();
                this.#welcomePage.showGUI();
                modal.hideGUI();
            })
        });


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
    
    get users() { return this.#users; }
    
    uploadCurrentUser() {
        
        console.log("inside chillBankApp.uploadCurrentUser()");

        this.#welcomePage.hideGUI();
        this.#userPage.showGUI();
        
        this.#userPage.onWithdrawSubmit((operationSection) => {
            if (operationSection.amount == "") {
                showPopup("Please insert a withdraw value before submitting.", 1500)
            } else if (operationSection.amount < 0) {
                showPopup("Please insert a positive withdraw value before submitting.", 1500)
            } else {
                this.#currentUser.makeOperation(new Withdrawal(operationSection.amount));
                this.#userPage.user = this.#currentUser;
            }
        });

        this.#userPage.onDepositSubmit((operationSection) => {
            if (operationSection.amount == "") {
                showPopup("Please insert a deposit value before submitting.", 1500)
            } else if (operationSection.amount < 0) {
                showPopup("Please insert a positive deposit value before submitting.", 1500)
            } else {
                this.#currentUser.makeOperation(new Deposit(operationSection.amount));
                this.#userPage.user = this.#currentUser;
            }
        });

        this.#userPage.onTransferSubmit((operationSection) => {
            if (operationSection.amount == "") {
                showPopup("Please insert a transfer value before submitting.", 1500)
            } else if (operationSection.amount < 0) {
                showPopup("Please insert a positive transfer value before submitting.", 1500)
            } else if (operationSection.receiver == "") {
                showPopup("Please insert a transfer receiver before submitting", 1500)
            } else {
                const receiver = this.getUserByName(operationSection.receiver);
                operationSection.clearReceiver();
                this.#currentUser.makeOperation(new Transfer(operationSection.amount, receiver));
                this.#userPage.user = this.#currentUser;
            }
        });
    }

}

class GUIItem {

    /**
     * @type {HTMLElement}
     */
    #gui;

    constructor(selector) {
        this.#gui = document.querySelector(selector);
    }
    
    /**
     * @returns {HTMLElement}
     */
    get gui() { return this.#gui; }

}

class WelcomePage extends GUIItem {
    

    /**
     * The login section of the Welcome Page.
     * @type {LoginForm}
     */
    #loginForm;
    
    /**
     * The button elements present in the Welcome Page that show the Login Section.
     * @type {HTMLButtonElement[]}
     */
    #loginFormButtons;

    constructor(selector) {
        super(selector);
        this.#loginForm = new LoginForm(`${selector} .login-section`);

        this.#loginFormButtons = document.querySelectorAll(`${selector} .login-form-button`);
        
        for (let loginFormButton of this.#loginFormButtons) {
            loginFormButton.addEventListener('click', () => {
                this.#loginForm.showGUI();
            });
        }
    }
    
    /**
     * Returns the login section of the welcome page.
     * @returns {LoginForm}
     */
    get loginForm() { return this.#loginForm; }
    
    /**
     * Hides the entire Welcome Page.
     */
    hideGUI() {
        this.gui.style.display = "none";
        this.#loginForm.hideGUI();
    }

    /**
     * Shows the entire Welcome Page.
     */
    showGUI() {
        this.gui.style.display = "block";
    }
    
    onLogin(func) {
        this.#loginForm.onLoginButtonClick(func);
    }
    
}

class LoginForm extends GUIItem {
    
    /**
     * @type {HTMLInputElement}
     */
    #usernameField;

    /**
     * @type {HTMLInputElement}
     */
    #passwordField;

    /**
     * @type {HTMLButtonElement}
     */
    #closeButton;

    /**
     * @type {HTMLButtonElement}
     */
    #loginButton;
    
    /**
     * @type {HTMLElememt}
     */
    #background;

    /**
     * Login form of the Chill Bank App.
     * @param {String} selector - The selector string to select the GUI login element
     * @param {Function} onLogin - The function to run when the login button of the login section is clicked.
     */
    constructor(selector, onLogin) {
        super(selector);
        this.#usernameField = document.querySelector(`${selector} .username-field`);
        this.#passwordField = document.querySelector(`${selector} .password-field`);
        this.#closeButton = document.querySelector(`${selector} .close-button`);
        this.#loginButton = document.querySelector(`${selector} .login-button`);
        this.#background = document.querySelector(`${selector} .background`);
        
        this.#closeButton.addEventListener('click', () => {
            this.hideGUI();
        });
        
        this.#background.addEventListener('click', () => {
            this.hideGUI();
        })
    }
    
    /**
     * The value that the user has inserted in the username field.
     * @returns {String}
     */
    get username() { return this.#usernameField.value; }

    /**
     * The value that the user has inserted in the password field.
     * @returns {String}
     */
    get password() { return this.#passwordField.value; }
    
    /**
     * The closing button of the login section.
     * @returns {HTMLButtonElement}
     */
    get closeButton() { return this.#closeButton; }

    /**
     * The login button of the login section.
     * @returns {HTMLButtonElement}
     */
    get loginButton() { return this.#loginButton; }
    
    /**
     * Shows the GUI of the login section.
     */
    showGUI() {
        this.gui.style.visibility = "visible";
        this.gui.style.opacity = 1;
        this.gui.style.display = "flex";
    }
    
    /**
     * Hides the GUI of the login section.
     */
    hideGUI() {
        this.gui.style.visibility = "hidden"
        this.gui.style.opacity = 0;
        this.gui.style.display = "none";
        this.#usernameField.value = null;
        this.#passwordField.value = null;
    }
    
    onLoginButtonClick(func) {
        this.#loginButton.addEventListener('click', () => {
           func(this); 
        });
    }

}

class UserPage extends GUIItem {
    
    /**
     * @type {HTMLButtonElement}
     */
    #logoutButton;
    
    /**
     * @type {LogoutModal}
     */
    #logoutModal;
    
    /**
     * @type {HTMLParagraphElement}
     */
    #usernameLabel;
    
    #withdrawSection;
    #depositSection;
    #transferSection;
    #userDataSection;
    
    /**
     *
     * @param {String} selector - Query string to select the HTML Element of the User Page
     * @param {User} user - User that the GUI shows the info of
     */
    constructor(selector) {
        super(selector);

        console.log("inside userPage() constructor");
        
        this.#logoutButton = document.querySelector(`${selector} .logout-button`);
        this.#usernameLabel = document.querySelector(`${selector} .navbar .username`);
        this.#logoutModal = new LogoutModal(`${selector} .logout-modal`);

        this.#withdrawSection = new WithdrawSection(`${selector} .withdrawal-section`);
        this.#depositSection = new DepositSection(`${selector} .deposit-section`);
        this.#transferSection = new TransferSection(`${selector} .transfer-section`);

        this.#userDataSection = new UserDataSection(`${selector} .user-data-section`);

    }
    
    atLogoutButtonClick(func) {
        console.log("inside userPage.atLogoutButtonClick()")
        this.#logoutButton.addEventListener('click', () => {
            func(this);
        })
    }
    
    hideGUI() {
        this.gui.style.display = "none";
    }
 
    showGUI() {
        this.gui.style.display = "flex";
    }
    
    set user(newUser) {
        console.log("inside userPage.user() setter")
        this.#userDataSection.user = newUser;
        this.#usernameLabel.textContent = `Hi, ${newUser.username}!`;
    }
    
    showLogoutModal(func) {
        console.log("inside userPage.showLogoutModal()")
        this.#logoutModal.showGUI();
        this.#logoutModal.onYes(func);
    }
    
    onWithdrawSubmit(func) {
        console.log("inside userPage.onWithdrawSubmit()");
        this.#withdrawSection.onSubmit(func);
    }
    
    onDepositSubmit(func) {
        this.#depositSection.onSubmit(func);
    }
    
    onTransferSubmit(func) {
        this.#transferSection.onSubmit(func);
    }

}

class OperationSection extends GUIItem {
    
    #submitButton;
    #field;

    constructor(selector) {
        super(selector);
        this.#submitButton = document.querySelector(`${selector} .submit-button`);
        this.#field = document.querySelector(`${selector} .field-amount`);
        this.#submitButton.setAttribute('listener', 'false')
    }
    
    /**
     * 
     * @param {Function} func
     */
    onSubmit(func) {
        console.log("inside operationSection.onSubmit()")
        console.log(`this.#submitButton.getAttribute('listener') == ${this.#submitButton.getAttribute('listener')}`)
        if (this.#submitButton.getAttribute('listener') === 'false') {
            this.#submitButton.setAttribute('listener', 'true');
            this.#submitButton.addEventListener('click', () => {
                func(this);
                this.clear();
            });
        }
    }
    
    get amount() { return this.#field.value; }
    
    clear() { this.#field.value = null; }
}

class WithdrawSection extends OperationSection {}

class DepositSection extends OperationSection {}

class TransferSection extends OperationSection {
    
    #receiverField;

    constructor(selector) {
        super(selector);
        this.#receiverField = document.querySelector(`${selector} .field-receiver`);
    }
    
    get receiver() { return this.#receiverField.value; }
    
    clearReceiver() {
        this.#receiverField.value = null;
    }

}

class UserDataSection extends GUIItem {
    
    /**
     * @type {User}
     */
    #user;

    #operationsHistory;
    #statisticsSection;

    constructor(selector) {
        super(selector);
        this.#operationsHistory = document.querySelector(`${selector} .operations-history`);
        this.#statisticsSection = new StatisticsSection(`${selector} .statistics-section`);
    }
    
    set user(newUser) {
        this.#user = newUser;
        this.refresh();
    }
    
    refresh() {
        
        console.log("inside userDataSection.refresh()")
        this.#operationsHistory.innerHTML = "";

        let totalChillAmount = 0;
        let withdrawChillAmount = 0;
        let depositChillAmount = 0;
        let transferChillAmount = 0;

        for (let operation of this.#user.operations) {
            console.log(`operation: ${operation.getType()} -> ${operation.amount} chill`);

            this.#operationsHistory.insertAdjacentHTML('beforeend', operation.getHTML())

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
        
        this.#statisticsSection.total = totalChillAmount;
        this.#statisticsSection.deposit = depositChillAmount;
        this.#statisticsSection.withdraw = withdrawChillAmount;
        this.#statisticsSection.transfer = transferChillAmount;
    }

}

class StatisticsSection extends GUIItem {
    
    #totalField;
    #withdrawField;
    #depositField;
    #transferField;
    
    constructor(selector) {
        super(selector);
        this.#totalField = document.querySelector(`${selector} .total-section .amount`);
        this.#withdrawField = document.querySelector(`${selector} .withdraw-section .amount`);
        this.#depositField = document.querySelector(`${selector} .deposit-section .amount`);
        this.#transferField = document.querySelector(`${selector} .transfer-section .amount`);
    }
    
    get total() { this.#totalField.textContent; }
    get withdraw() { this.#withdrawField.textContent; }
    get deposit() { this.#depositField.textContent; }
    get transfer() { this.#transferField.textContent; }

    set total(amount) { this.#totalField.textContent = amount; }
    set withdraw(amount) { this.#withdrawField.textContent = amount; }
    set deposit(amount) { this.#depositField.textContent = amount; }
    set transfer(amount) { this.#transferField.textContent = amount; }
    
}

class LogoutModal extends GUIItem {
    
    #yesButton;
    #noButton;
    
    constructor(selector) {
        super(selector);
        this.#yesButton = document.querySelector(`${selector} .yes`)
        this.#noButton = document.querySelector(`${selector} .no`)

        this.#noButton.addEventListener('click', () => {
            this.hideGUI();
        })
    }
    
    showGUI() {
        this.gui.style.visibility = "visible";
        this.gui.style.opacity = 1;
        this.gui.style.display = "flex";
    }

    hideGUI() {
        this.gui.style.visibility = "hidden"
        this.gui.style.opacity = 0;
        this.gui.style.display = "none";
    }
    
    onYes(func) {
        this.#yesButton.addEventListener('click', () => {
            func(this);
        })
    }

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

