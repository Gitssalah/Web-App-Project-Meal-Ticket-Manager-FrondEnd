async function fetchData() {
    try {
        const userID = localStorage.getItem("userID");
  
        const totalSoldeResponse = await fetch(`http://localhost:8955/API/CarteVirtuelle/${userID}/solde`);
        const totalSoldeData = await totalSoldeResponse.json();
        if (!totalSoldeResponse.ok) {
            console.error("Error fetching total solde data:", totalSoldeData);
            throw new Error("Error fetching total solde data");
        }
        const totalSolde = totalSoldeData.solde;

        const dailySoldeResponse = await fetch(`http://localhost:8955/API/CarteVirtuelle/${userID}/soldeJournalier`);
        const dailySoldeData = await dailySoldeResponse.json();
        if (!dailySoldeResponse.ok) {
            console.error("Error fetching daily solde data:", dailySoldeData);
            throw new Error("Error fetching daily solde data");
        }
        const dailySolde = dailySoldeData.soldeJournalier;
        const dailyLimit = dailySoldeData.plafondQuotidien;

        const transactionsResponse = await fetch(`http://localhost:8955/API/Transaction/getTransactions/${userID}`);
        const transactionsData = await transactionsResponse.json();
        let transactionsArray=[];
        if(transactionsData.transactions!=null){
            transactionsArray = transactionsData.transactions;
        }
        console.log("transactions",transactionsArray);
        if (!transactionsResponse.ok) {
            console.error("Error fetching transactions data:", transactionsData);
            throw new Error("Error fetching transactions data");
        }

        updateSoldeDisplay(totalSolde, dailySolde, dailyLimit);
        createPieChart(dailySolde, dailyLimit);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
    }
}
  
function updateSoldeDisplay(totalSolde, dailySolde, dailyLimit) {
    const totalSoldElement = document.querySelector(".total-sold");
    totalSoldElement.textContent = `Solde total: ${totalSolde} €`;
  
    const dailySoldElement = document.querySelector(".daily-sold");
    dailySoldElement.textContent = `Solde du jour: ${dailySolde} € / ${dailyLimit} €`;
}

function createPieChart(dailySolde, dailyLimit) {
    var ctx = document.getElementById('pie-chart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Solde journalier restant', 'Solde non disponible'],
            datasets: [{
                label: 'Solde du jour vs Plafond quotidien',
                data: [dailySolde, dailyLimit - dailySolde],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)', // Solde du jour color
                    'rgba(54, 162, 235, 0.5)'   // Plafond quotidien color
                ],
                borderWidth: 1,
                // Add the following to calculate the ratio of daily spent amount to daily limit
                calculator: function(element) {
                    return (element.dataset.data[0] / (element.dataset.data[0] + element.dataset.data[1])) * 100;
                }
            }]
        },
        options: {
            // Add the following to display the ratio as a percentage in the pie chart
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].calculator(data.datasets[tooltipItem.datasetIndex]).toFixed(1) + '%';
                    }
                }
            }
        }
    });
}
function processTransactionsData(transactionsData) {
    // Transform the fetched data into an array of objects with the desired format
    return transactionsData.transactions.map((transaction) => {
        const date = new Date(transaction.date);
        return {
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            amount: transaction.amount,
            merchant: transaction.merchant,
        };
    });
}

fetchData();