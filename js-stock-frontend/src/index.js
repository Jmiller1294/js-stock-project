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
            const h1 = document.createElement('h1')
           
            please.style.visibility = 'hidden'
            loginForm.style.visibility = 'hidden'
            h1.style.color = 'white'
            h1.id = "user-welcome"
            h1.innerText = `Welcome, ${user.username.toUpperCase()}`
            
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
            const obj = data.find(e => e.ticker === searchBar||e.ticker.toLowerCase() === searchBar||e.company === searchBar||e.company.toLowerCase() === searchBar)
            let stock = new Stock(obj)
            showStockListing(stock)
            buyStock(stock, user)
        }).catch(function(){
            if(document.getElementById('not-found')){
                console.log("hello")
            }
            else {
                const main = document.querySelector('main')
                const div = document.getElementById('search-container')
                const d = document.createElement('div')
                const p = document.createElement('p')
                p.id = "not-found"
                p.innerText = "Stock Not Found!"
                p.style.color = "white"
            
            
                div.appendChild(d)
                div.appendChild(p)
            }
        })
    })
}



function showStockListing(stock){
    if(document.getElementById('search-info')){
        console.log('helloooo')
    }
    else {
        const main = document.querySelector('main')
        const div = document.getElementById('search-container')
        const d = document.createElement('div')
        const p = document.createElement('p')
        const buyStock = document.createElement('form')
        const input = document.createElement('input')
        const submit = document.createElement('input')


        p.id = 'search-info'
        p.innerText = `Ticker: ${stock.ticker}
                        Company: ${stock.company}
                        Current Price: $${stock.current_price}`
        p.style.color = "white"


        input.setAttribute("type", "text")
        submit.setAttribute("type", "submit")
        submit.setAttribute("value", "Buy Stock")
        input.id = 'stock-number'
        submit.id = "buy-button"

        buyStock.appendChild(input)
        buyStock.appendChild(submit)
        

        div.appendChild(d)
        div.appendChild(p)
        div.appendChild(buyStock)
    }
}



function buyStock(stock, user) {
    const buyButton = document.getElementById('buy-button')

    buyButton.addEventListener('click', function(event){
        event.preventDefault()

        fetch(`http://localhost:3000/users/${user.id}`)
        .then(response => response.json())
        .then(function(user){
            const match = user.stocks.find(s => s.ticker === stock.ticker||s.company === stock.company)
            if(match){
                const stockNumber = document.getElementById('stock-number').value
                if (isNaN(stockNumber)||stockNumber ==="") {
                    console.log("Not A Number!")
                }
                else {
                    let newShares = 0
                    newShares += (match.shares + parseInt(stockNumber))
                    let marketValue = 0
                    marketValue += (parseInt(newShares) * parseInt(match.current_price))
                    let updatedObj = {shares: newShares, market_value: marketValue}
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
                            text.innerText = `Ticker: ${updatedShares.ticker}
                            Opening Price: $${updatedShares.current_price}
                            Shares: ${updatedShares.shares}
                            Market Value: $${updatedShares.market_value}` 
                        })
                }   
            }
            else {
                const stockNumber = document.getElementById('stock-number').value
                if (isNaN(stockNumber)||stockNumber ==="") {
                    console.log("Not A Number!")
                }
                else {
                
                    let newObj = {ticker: stock.ticker, company: stock.company, current_price: stock.current_price, shares: stockNumber, market_value: (stockNumber * stock.current_price), user_id: user.id}
                    let newData = Object.assign({}, newObj)
        
                    fetch('http://localhost:3000/stocks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                            body: JSON.stringify(newData)
                    })
                    .then(response => response.json())
                    .then(stock => addStock(stock,user))
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
            

function addStock(stock,user) {
    const div = document.getElementById('stock-container')
    const parentD = document.createElement('div')
    const companyName = document.createElement('h2')
    const h3 = document.createElement('h3')
    const d = document.createElement('div')
    const p = document.createElement('p') 
    const deleteButton = document.createElement('button')
    
    parentD.id = `parent-${stock.id}` 
    companyName.id = `company-name-${stock.id}`
    h3.id = `h3-${stock.id}`  
    d.id = `chartContainer${stock.id}`
    p.id = `text-${stock.id}`
    deleteButton.id = `sell-button-${stock.id}`

    parentD.className = 'parent'
    companyName.className = 'company'
    h3.className = 'current-price'
    d.className = 'chart'
    p.className = 'text'
    deleteButton.className = 'sell-button'
    
    p.innerText = `Ticker: ${stock.ticker}
        Opening Price: $${stock.current_price}
        Shares: ${stock.shares}
        Market Value: $${stock.market_value}` 
    deleteButton.innerHTML = "Sell All Shares"
    companyName.innerHTML=`${stock.company}`
    h3.innerHTML = `Current Price: $${stock.current_price}`

    d.style = "height: 300px; width:35%;"
    p.style.color = "white"
    companyName.style.color = "white"
    h3.style.color = "white"

    div.appendChild(parentD)
    parentD.appendChild(companyName)
    parentD.appendChild(h3)
    parentD.appendChild(d)
    parentD.appendChild(d)
    parentD.appendChild(p)
    parentD.appendChild(deleteButton)
     
    deleteButton.addEventListener('click',function(e){
        e.preventDefault()
        parentD.parentNode.removeChild(parentD)
        p.parentNode.removeChild(p)
        deleteButton.parentNode.removeChild(deleteButton)
        deleteStock(stock)
    })
    renderChart(stock)
}


function renderChart(stock){
    let time = new Date()
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

        if (currentPrice){
            currentPrice.innerHTML = `Current Price: $${yValue.toFixed(2)}`
        }

    chart.render();		
    };
    setInterval(function(){updateChart()}, 1000); 
}









