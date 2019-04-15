//Article - How much vacation time I have left | You have {{ vacationBalance() }} days left.

nanorep.floatingWidget.on('load', function() {
    this.api.conversation.registerClientMethods({

        vacationBalance: function() {
            balance = Math.floor((Math.random() * 10) + 1); //API call to HR software
            return balance;
    } 

    });  
});


