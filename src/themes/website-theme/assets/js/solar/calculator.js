Vue.filter('format-number', function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
})

Vue.component('solar-calculator', {
    template: '#solar-calculator-template',
    data() {
        return {
            pricePerWatt: 2.74,
            annualOutputPerKilowatt: 1700,
            outputFactor: 0.78,
            totalPanels: 40,
            wattsPerPanel: 335,
            costPerKilowatt: 0.13,
            averageMonthlyBill: 250,
            taxCreditPercentage: 30,
            annualPercentageRate: 2.99,
            loanTerm: 10,
            loanPercentage: 70
        };
    },
    computed: {
        totalKilowatts() {
            return (this.totalPanels * this.wattsPerPanel) / 1000;
        },
        totalAnnualKilowatts() {
            return this.totalKilowatts * this.annualOutputPerKilowatt * this.outputFactor;
        },
        annualSavings() {
            return this.totalAnnualKilowatts * this.costPerKilowatt;
        },
        monthlySavings() {
            return this.annualSavings / 12;
        },
        remainingMonthlyBill() {
            return this.averageMonthlyBill - this.monthlySavings;
        },
        totalCost() {
            return (this.totalKilowatts * 1000) * this.pricePerWatt;
        },
        totalTaxCredit() {
            return this.totalCost * (this.taxCreditPercentage / 100);
        },
        totalCostAfterTaxCredit() {
            return this.totalCost * (1 - (this.taxCreditPercentage / 100));
        },
        actualMonthlyCost() {
            return this.remainingMonthlyBill + this.loan.monthlyPayment;
        },
        totalSavings() {
            return this.averageMonthlyBill - this.actualMonthlyCost;
        },
        loan() {
            const principal = this.totalCost * (this.loanPercentage / 100);
            const totalPayments = this.loanTerm * 12;
            const interestRate = (this.annualPercentageRate / 100) / 12;
            const monthly = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -totalPayments));

            return {
                monthlyPayment: monthly,
                totalRepayment: (monthly * totalPayments),
                interestPaid: ((monthly * totalPayments) - principal)
            };
        }
    }
});

new Vue({
    el: '#calculator'
});