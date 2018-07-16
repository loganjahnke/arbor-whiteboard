function Tutor(fname, lname, email, clients) {
    this.firstname = fname;
    this.lastname = lname;
    this.email = email;
    this.clients = clients;
}

function Client(accountNumber, fname, lname, email) {
    this.accountNumber = accountNumber;
    this.firstname = fname;
    this.lastname = lname;
    this.email = email;
}