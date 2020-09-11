document.addEventListener('DOMContentLoaded', (event) => {
        login();    
       
})
   

class User {
    constructor(data){
        this.username = data.username
        this.id = data.id
    }
}

    
function login(){
    const loginFormContainer = document.getElementById('login-form-container')
    const loginForm = document.getElementById('login-form')
    const loginButton = document.getElementById('login-button')
    const please = document.getElementById('please')
    const stockHeader = document.getElementById('portfolio')
    stockHeader.style.visibility = 'hidden'
    
    loginButton.addEventListener('click', function(event){
        event.preventDefault()
        
        const username = document.getElementById('username-field').value
        usernameObj = {username: username}

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usernameObj)
        })
        .then(response => response.json())
        .then(function(user){
            let currentUser = new User(user)
            const h1 = document.createElement('h1')
            
            please.style.visibility = 'hidden'
            loginForm.style.visibility = 'hidden'
            h1.style.color = 'white'
            
            h1.id = 'user-welcome'
            h1.innerText = `Welcome, ${user.username.toUpperCase()}`
            
            loginFormContainer.appendChild(h1)

            if(currentUser.username) {
                stockHeader.style.visibility = 'visible'
                searchBar(currentUser)
                renderSortButton()
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

    showStockListing(){
        if(document.getElementById('search-info')){
            
        }
        else {
            const parentDiv = document.getElementById('search-container')
            const p = document.createElement('p')
            const buyStock = document.createElement('form')
            const input = document.createElement('input')
            const submit = document.createElement('input')
    
            p.id = 'search-info'
            p.innerText = `Ticker: ${this.ticker}
                            Company: ${this.company}
                            Current Price: $${parseFloat(this.current_price).toFixed(2)}`
            p.style.color = "white"
    
            input.setAttribute("type", "text")
            submit.setAttribute("type", "submit")
            submit.setAttribute("value", "Buy Stock")
            input.id = 'stock-number'
            submit.id = 'buy-button'

            buyStock.appendChild(input)
            buyStock.appendChild(submit)
            
            parentDiv.appendChild(p)
            parentDiv.appendChild(buyStock)
        }
    }

}



function searchBar(currentUser){       
    const parentDiv = document.getElementById('search-form-container')
    const searchContainer = document.getElementById('search-container')
    const searchForm = document.createElement('form')
    const input = document.createElement('input')
    const submit = document.createElement('input')

    input.setAttribute("type", "text")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Search")
    searchForm.id = "search-form"
    input.id = 'search-item'
    submit.id = 'search-button'

    searchForm.appendChild(input)
    searchForm.appendChild(submit)
    parentDiv.appendChild(searchForm)

    const searchItem = document.getElementById('search-item')

    searchItem.addEventListener('click', function(event){
        searchItem.value =""
        searchContainer.innerHTML = ""
    })
    searchItem.addEventListener('keydown',function(event){
        if(event.key == 'Backspace') {
            searchItem.value =""
            searchContainer.innerHTML = ""
        }
    })

    const searchButton = document.getElementById('search-button')

    searchButton.addEventListener('click', function(event){
        event.preventDefault()
        const searchBar = document.getElementById('search-item').value
    
        fetch(`http://localhost:3000/stocklistings`)
        .then(response => response.json())
        .then(function(data){
            const obj = data.find(e => e.ticker === searchBar||e.ticker.toLowerCase() === searchBar||e.company === searchBar||e.company.toLowerCase() === searchBar||e.ticker.toUpperCase() === searchBar||e.company === searchBar||e.company.toUpperCase() === searchBar)
            let stock = new Stock(obj)

            stock.showStockListing()
            buyStock(stock, currentUser)

        }).catch(function(){
            if(document.getElementById('not-found')){
                
            }
            else {
                const parentDiv = document.getElementById('search-container')
                const d = document.createElement('parentDiv')
                const p = document.createElement('p')

                p.id = "not-found"
                p.innerText = "Stock Not Found!"
                p.style.color = "white"
            
                parentDiv.appendChild(d)
                parentDiv.appendChild(p)
            }
        })
    })
}



function buyStock(stock, currentUser) {
    const buyButton = document.getElementById('buy-button')

    buyButton.addEventListener('click', function(event){
        event.preventDefault()

        alert("Are you sure you want to purchase this stock?")
        fetch(`http://localhost:3000/users/${currentUser.id}`)
        .then(response => response.json())
        .then(function(user){
            const match = user.stocks.find(s => s.ticker === stock.ticker||s.company === stock.company)
            if(match){
                const stockNumber = document.getElementById('stock-number').value
                if (isNaN(stockNumber)||stockNumber ==="") {
                   
                }
                else {
                    let newShares = 0
                    newShares += (match.shares + parseInt(stockNumber))
                    
                    let marketValue = 0
                    marketValue += (newShares * match.current_price)
                    
                    let updatedObj = {shares: newShares, market_value: marketValue.toFixed(2)}
                    let updatedShares = Object.assign(match, updatedObj)
                
                    fetch(`http://localhost:3000/stocks/${match.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedShares)
                    })
                    .then(function(){
                        const text = document.getElementById(`text-${match.id}`)
                        const profit = document.getElementById(`profit`)
                        text.innerText = `Ticker: ${updatedShares.ticker}
                        Opening Price: $${parseFloat(updatedShares.current_price).toFixed(2)}
                        Shares: ${updatedShares.shares}
                        Market Value: $${parseFloat(updatedShares.market_value).toFixed(2)}` 
                        profit.innerHTML = `Profit: $ ${0}`
                    })
                }   
            }
            else {
                const stockNumber = document.getElementById('stock-number').value
                if (isNaN(stockNumber)||stockNumber ==="") {
                   
                }
                else {
                    let newObj = { ticker: stock.ticker, 
                                   company: stock.company, 
                                   current_price: parseFloat(stock.current_price).toFixed(2), 
                                   shares: stockNumber, market_value: stockNumber * parseFloat(stock.current_price).toFixed(2), 
                                   user_id: user.id }
                    let newData = Object.assign({}, newObj)
        
                    fetch('http://localhost:3000/stocks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                            body: JSON.stringify(newData)
                    })
                    .then(response => response.json())
                    .then(stock => renderStock(stock))
                }    
            }
                   
        })
                
    })
}
       

function deleteStock(stock){
    fetch(`http://localhost:3000/stocks/${stock.id}`, {
        
        method: 'DELETE'
    })   
 }
            

function renderStock(stock) {
    

    const parentDiv = document.getElementById('stock-container')
    const div = document.createElement('div')
    const companyName = document.createElement('h2')
    const h3 = document.createElement('h3')
    const d = document.createElement('div')
    const p = document.createElement('p') 
    const p2 = document.createElement('p')
    const deleteButton = document.createElement('button')
    
    div.id = `parent-${stock.id}` 
    companyName.id = `company-name-${stock.id}`
    h3.id = `h3-${stock.id}`  
    d.id = `chartContainer${stock.id}`
    p.id = `text-${stock.id}`
    p2.id = `profit-${stock.id}`
    deleteButton.id = `sell-button-${stock.id}`

    div.className = 'parent'
    companyName.className = 'company'
    h3.className = 'current-price'
    d.className = 'chart'
    p.className = 'text'
    p2.className = 'profit'
    deleteButton.className = 'sell-button'
    
    p.innerText = `Ticker: ${stock.ticker}
        Opening Price: $${parseFloat(stock.current_price).toFixed(2)}
        Shares: ${stock.shares}
        Market Value: $${parseFloat(stock.market_value).toFixed(2)}
        ` 
    p2.innerHTML = `Profit Per Share: $${0}`
    deleteButton.innerHTML = "Sell All Shares"
    companyName.innerHTML=`${stock.company}`
    h3.innerHTML = `Current Price: $${stock.current_price}`

    d.style = "height: 300px; width:35%;"
    p.style.color = "white"
    companyName.style.color = "white"
    p2.style.color = "white"
    h3.style.color = "white"

    parentDiv.appendChild(div)
    div.appendChild(companyName)
    div.appendChild(h3)
    div.appendChild(d)
    div.appendChild(d)
    div.appendChild(p)
    div.appendChild(p2)
    div.appendChild(deleteButton)
     
    deleteButton.addEventListener('click',function(e){
        e.preventDefault()
        div.parentNode.removeChild(div)
        p.parentNode.removeChild(p)
        deleteButton.parentNode.removeChild(deleteButton)
        deleteStock(stock)
    })
    renderChart(stock)
}


function renderChart(stock){
    let dataset = [{ x: 1,  y: parseInt(stock.current_price)}]
    
    let chart = new CanvasJS.Chart(`chartContainer${stock.id}`, {
        theme: "dark1",
        title:{
            text: "Stock Performance"              
        },
        axisX: {
            crosshair: {
              enabled: true,
            },
            title:"Seconds"
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
    
    let xValue = 2
    let yValue = parseInt(stock.current_price);
    
    let updateChart = function() {
        yValue = yValue + (Math.random() - 0.50);
        xValue = xValue + 1;
        dataset.push({x: xValue,y: yValue});

        const currentPrice = document.getElementById(`h3-${stock.id}`) 
        const profit = document.getElementById(`profit-${stock.id}`)

        if (currentPrice){
            currentPrice.innerHTML = `Current Price: $${yValue.toFixed(2)}`
            profit.innerHTML = `Profit Per Share: $ ${(parseFloat(yValue - stock.current_price).toFixed(2))}` 
        }

    chart.render();		
    };
    setInterval(function(){updateChart()}, 1000); 
}


function renderSortButton() {
    const portfolio = document.getElementById('sort-container')
    const button = document.createElement('button')
    button.id = "sort-button"
    button.innerText = "Sort Stocks"
    portfolio.appendChild(button)
    alphabetize()
}

function alphabetize() {
    const sortButton = document.getElementById('sort-button')
    
    sortButton.addEventListener('click', function(event){   

    array = []
    let stocks = document.querySelectorAll(".parent")

        for(let i = 0; i < stocks.length; i++) {
            array.push(stocks[i])
        }

    let newArray = array.sort(function(a,b){
       if (a.firstChild.innerHTML > b.firstChild.innerHTML) {
            return 1;
       }
       if (a.firstChild.innerHTML < b.firstChild.innerHTML) {
           return -1;
       }
    })

    const stockContainer = document.getElementById('stock-container')
    stockContainer.innerHTML = ""

        for (i = 0; i < newArray.length; i++) {
        stockContainer.appendChild(newArray[i])
        }
    })
}









