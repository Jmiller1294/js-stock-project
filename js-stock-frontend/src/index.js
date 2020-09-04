document.addEventListener('DOMContentLoaded', (event) => {
        login();
    })
   



function login(){
    const loginForm = document.getElementById('login-form')
    const loginButton = document.getElementById('login-button')
    

    loginButton.addEventListener('click', function(event){
        event.preventDefault()
        const username = document.getElementById('username-field').value
        usernameObject = {username: username}

        
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usernameObject)
        })
        .then(response => response.json())
        .then(function(user){
            
           
            
            loginForm.style.visibility = 'hidden'
            const loginFormCon = document.getElementById('login-form-container')
            const h1 = document.createElement('h1')
            h1.innerText = `Welcome, ${user.username}`
            loginFormCon.appendChild(h1)
            getStocks();
        })
        
    

    
    
    })
    

    searchBar();
    
}


function buyStock() {

            
            const buyButton = document.getElementById('buy-button')



            buyButton.addEventListener('click', function(event){
            event.preventDefault()
            const stockNumber = document.getElementById('stocknumber').value
            console.log(data)
            let newObj = {ticker: data.ticker, company: data.company, current_price: data.current_price, shares: stockNumber, market_value: (stockNumber * data.current_price), user_id: 1}
            let newData = Object.assign({}, newObj)
        
            fetch('http://localhost:3000/stocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(response => response.json())
        .then(data => getStocks(newObj))
    })
}


function getStocks(newObj){
    fetch(`http://localhost:3000/users/1`)
    .then(response => response.json())
    .then(data => stock(data))

    
    const main = document.querySelector('main')
    const div = document.getElementById('stockcontainer')
   

    function stock(data) {
        let stocks = data.stocks.map(stock => {
            
            
       
            console.log(stock)
            
            
            

            const d = document.createElement('div')
            d.id = `chartContainer${stock.id}`
            d.className = 'chart'
            d.style = "height: 300px; width:35%;"
           
            const p = document.createElement('p')
            p.innerText = `Ticker: ${stock.ticker}
                           Company: ${stock.company}
                           Current Price: ${stock.current_price}
                           Shares: ${stock.shares}
                           Market Value: ${stock.market_value}` 
            div.appendChild(d)
            div.appendChild(p)
            
        
        let time = new Date()
        let dataset = [{ x: `${time.getHours()}`,  y: parseInt(stock.current_price)}]
    



        let chart = new CanvasJS.Chart(`chartContainer${stock.id}`, {
            title:{
                text: "Stock Performance"              
            },
            axisY: {						
                title:"Stock Price"
            },
            data: [{            
            
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "line",
                dataPoints: dataset
                   
            
        }]
            
        })
        chart.render()

        let xVal = time.getHours();
    let yVal = parseInt(stock.current_price);	
    
 
    let updateChart = function () {
	
	
		yVal = yVal + (Math.random() - 0.50);
		dataset.push({x: xVal,y: yVal});
		
		xVal = xVal + 0.001;
	
	chart.render();		
        stock.current_price
	// update chart after specified time. 
 
};
setInterval(function(){updateChart()}, 1000); 





        
    })
    return stocks  
    








}
    
}




function searchBar(){       

const searchBar = document.getElementById('searchbar')
searchBar.addEventListener('click', function(event){


const searchContainer = document.getElementById('searchContainer')
searchContainer.innerHTML = ""

})

const searchButton = document.getElementById('search-button')
searchButton.addEventListener('click', function(event){
    const searchBar = document.getElementById('searchbar').value
    event.preventDefault()
    
    fetch(`http://localhost:3000/stocklistings`)
    .then(response => response.json())
    .then(function(data){
        const a = data.find(e => e.ticker === searchBar||e.company === searchBar)
        showStock(a)
    })
    
})
    
}


function showStock(data){
    const main = document.querySelector('main')
    const div = document.getElementById('searchContainer')
    console.log(data)

    const d = document.createElement('div')
    const p = document.createElement('p')
    p.id = 'searchinfo'
    const buyStock = document.createElement('form')
    const input = document.createElement('input')
    const submit = document.createElement('input')
    input.setAttribute("type", "text")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Buy Stock")
    input.id = 'stocknumber'
    submit.id = "buy-button"
    
            p.innerText = `Ticker: ${data.ticker}
                           Company: ${data.company}
                           Current Price: ${data.current_price}`
            
            div.appendChild(d)
            div.appendChild(p)
            buyStock.appendChild(input)
            buyStock.appendChild(submit)
            div.appendChild(buyStock)
}



function getUser(){

    fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => user(data))

    function user(data) {
    let users = data.map(user => {
        const title = document.getElementById('header')
        title.innerText = `Hello, ${user.username}`
        return title
    })
    return users
    }   
}





