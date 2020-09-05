document.addEventListener('DOMContentLoaded', (event) => {
        login();    
})
   

    

function login(){
    const loginFormContainer = document.getElementById('login-form-container')
    const loginForm = document.getElementById('login-form')
    const loginButton = document.getElementById('login-button')
    const please = document.getElementById('please')
    const stockHeader = document.getElementById('portfolio')
    stockHeader.style.visibility = "hidden"
    

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
            const h1 = document.createElement('h1')
           
            please.style.visibility = 'hidden'
            loginForm.style.visibility = 'hidden'
            h1.style.color = 'white'
            h1.id = "user-welcome"
            h1.innerText = `Welcome, ${user.username}`
            
            loginFormContainer.appendChild(h1)

            if(user.username) {
                stockHeader.style.visibility = "visible"
                searchBar(user)
            }
        })
    
    })
    
}


class Stock {
    constructor(data){
        this.id = data.id
        this.ticker = data.ticker
        this.company = data.company
        this.current_price = data.current_price
        this.shares = 0
        this.market_value = 0
    }
}



function searchBar(user){       
    const div = document.getElementById('search-form-container')
    const searchContainer = document.getElementById('search-container')
    const searchForm = document.createElement('form')
    const input = document.createElement('input')
    const submit = document.createElement('input')


    input.setAttribute("type", "text")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Search")
    searchForm.id = "search-form"
    input.id = 'search-item'
    submit.id = "search-button"


    searchForm.appendChild(input)
    searchForm.appendChild(submit)
    div.appendChild(searchForm)


    const searchItem = document.getElementById('search-item')

    searchItem.addEventListener('click', function(event){
        searchItem.value =""
        searchContainer.innerHTML = ""
    })


    const searchButton = document.getElementById('search-button')

    searchButton.addEventListener('click', function(event){
        event.preventDefault()
        const searchBar = document.getElementById('search-item').value
    
        fetch(`http://localhost:3000/stocklistings`)
        .then(response => response.json())
        .then(function(data){
            const a = data.find(e => e.ticker === searchBar||e.company === searchBar)
            let b = new Stock(a)
            showStockListing(b)
            buyStock(b,user)
        })
    })
}



function showStockListing(b){
    const main = document.querySelector('main')
    const div = document.getElementById('search-container')
    const d = document.createElement('div')
    const p = document.createElement('p')

    p.id = 'search-info'
    p.innerText = `Ticker: ${b.ticker}
                    Company: ${b.company}
                    Current Price: ${b.current_price}`
    p.style.color = "white"

    div.appendChild(d)
    div.appendChild(p)

}




function buyStock(data,user) {
    const div = document.getElementById('search-container')
    const buyStock = document.createElement('form')
    const input = document.createElement('input')
    const submit = document.createElement('input')
            
    input.setAttribute("type", "text")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Buy Stock")
    input.id = 'stock-number'
    submit.id = "buy-button"

    buyStock.appendChild(input)
    buyStock.appendChild(submit)
    div.appendChild(buyStock)
    
    const buyButton = document.getElementById('buy-button')

    buyButton.addEventListener('click', function(event){
        event.preventDefault()

        fetch(`http://localhost:3000/users/${user.id}`)
        .then(response => response.json())
        .then(function(user){
            const a = user.stocks.find(stock => stock.ticker === data.ticker||stock.company === data.company)
            if(a){
                        
                const stockNumber = document.getElementById('stock-number').value
                let newShares = 0
                newShares += (a.shares + parseInt(stockNumber))
                let marketValue = 0
                marketValue += (parseInt(newShares) * parseInt(a.current_price))
                let updatedObj = {shares: newShares, market_value: marketValue}
                let updatedShares = Object.assign(a,updatedObj)
                        

                fetch(`http://localhost:3000/stocks/${a.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                        body: JSON.stringify(updatedShares)
                    })
                    .then(function(){
                        const text = document.getElementById(`text-${a.id}`)
                        text.innerText = `Ticker: ${updatedShares.ticker}
                        Company: ${updatedShares.company}
                        Current Price: ${updatedShares.current_price}
                        Shares: ${updatedShares.shares}
                        Market Value: ${updatedShares.market_value}` 
                    })
            }
            else {
                const stockNumber = document.getElementById('stock-number').value
                let newObj = {ticker: data.ticker, company: data.company, current_price: data.current_price, shares: stockNumber, market_value: (stockNumber * data.current_price), user_id: user.id}
                let newData = Object.assign({}, newObj)
        
                fetch('http://localhost:3000/stocks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                        body: JSON.stringify(newData)
                    })
                    .then(response => response.json())
                    .then(data => addStock(data,user))
                      
            }
                   
        })
                
    })
}
            

            

function addStock(data,user) {
    console.log(data.market_value)
    const div = document.getElementById('stock-container')
    const d = document.createElement('div')
    const p = document.createElement('p') 
    const deleteButton = document.createElement('button')

        
    d.id = `chartContainer${data.id}`
    d.className = 'chart'
    d.style = "height: 300px; width:35%;"
    p.id = `text-${data.id}`
    p.innerText = `Ticker: ${data.ticker}
        Company: ${data.company}
        Current Price: ${data.current_price}
        Shares: ${data.shares}
        Market Value: ${data.market_value}` 
        deleteButton.innerHTML = "Sell All Shares"
    p.style.color = "white"
    div.appendChild(d)
    div.appendChild(p)
    div.appendChild(deleteButton)
    

    deleteButton.addEventListener('click',function(){
        deleteButton()
    })

    let time = new Date()
    let dataset = [{ x: `${time.getHours()}`,  y: parseInt(data.current_price)}]
    let chart = new CanvasJS.Chart(`chartContainer${data.id}`, {
        title:{
            text: "Stock Performance"              
        },
        axisY: {						
            title:"Stock Price"
        },
        data: [{            
            type: "line",
            dataPoints: dataset
        }]
    })
    chart.render()

    let xVal = time.getHours();
    let yVal = parseInt(data.current_price);	

    let updateChart = function () {

    yVal = yVal + (Math.random() - 0.50);
    dataset.push({x: xVal,y: yVal});
    xVal = xVal + 0.001;

    chart.render();		
    data.current_price


    };
    setInterval(function(){updateChart()}, 1000); 
}







function deleteStock(data){

    fetch(`http://localhost:3000/stocks/${data.id}`, {

    method: 'DELETE'
    })
 }





