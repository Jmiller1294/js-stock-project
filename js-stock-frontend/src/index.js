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
            
           
            please.style.visibility = 'hidden'
            loginForm.style.visibility = 'hidden'
            const h1 = document.createElement('h1')
            h1.id = "user-welcome"
            h1.innerText = `Welcome, ${user.username}`
            h1.style.color = 'white'
            loginFormContainer.appendChild(h1)

            if(user.username) {
                stockHeader.style.visibility = "visible"
                searchBar()
            }
        })
        
    

    
    
    })
    
    
}


function showStock(data){
    const main = document.querySelector('main')
    const div = document.getElementById('searchContainer')


    const d = document.createElement('div')
    const p = document.createElement('p')
    p.id = 'searchinfo'
    p.innerText = `Ticker: ${data.ticker}
                           Company: ${data.company}
                           Current Price: ${data.current_price}`
    p.style.color = "white"
    div.appendChild(d)
    div.appendChild(p)
            


}


function buyStock(data) {
    const div = document.getElementById('searchContainer')
            
            
            const buyStock = document.createElement('form')
            const input = document.createElement('input')
            const submit = document.createElement('input')
            input.setAttribute("type", "text")
            submit.setAttribute("type", "submit")
            submit.setAttribute("value", "Buy Stock")
            input.id = 'stocknumber'
            submit.id = "buy-button"


            
           
            buyStock.appendChild(input)
            buyStock.appendChild(submit)
            div.appendChild(buyStock)


            const buyButton = document.getElementById('buy-button')

            buyButton.addEventListener('click', function(event){
                event.preventDefault()
                fetch('http://localhost:3000/users/1')
                .then(response => response.json())
                .then(function(user){
                    const a = user.stocks.find(stock => stock.ticker === data.ticker||stock.company === data.company)
                    if(a){
                        
                        const stockNumber = document.getElementById('stocknumber').value
                        
                        let newShares = 0
                        newShares += (a.shares + parseInt(stockNumber))
                        let updatedObj = {shares: newShares}
                       
                        let updatedShares = Object.assign(a,updatedObj)
                        console.log(updatedShares)

                        fetch(`http://localhost:3000/stocks/${a.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                                    body: JSON.stringify(updatedShares)
                        })
                        .then(function(){

                            const text = document.getElementById(`text-${data.id}`)
                        text.innerText = `Ticker: ${updatedShares.ticker}
                       Company: ${updatedShares.company}
                       Current Price: ${updatedShares.current_price}
                       Shares: ${updatedShares.shares}
                       Market Value: ${updatedShares.market_value}` 
                        })
                        
                        
                        
                        
    

    

                  
  

                        
                    }
                    else {
                        
                        const stockNumber = document.getElementById('stocknumber').value
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
                        .then(data => addStock(data))
                      
                    }
                   
                })
                
                })
}
            

                




                
                



function getStocks(newObj){
    fetch(`http://localhost:3000/users/1`)
    .then(response => response.json())
    .then(user => stock(user))

    
    const main = document.querySelector('main')
    
   

}



function addStock(data) {
    
        
        
   
        
        const div = document.getElementById('stockcontainer')
        
        

        const d = document.createElement('div')
        d.id = `chartContainer${data.id}`
        d.className = 'chart'
        d.style = "height: 300px; width:35%;"
       
        const p = document.createElement('p')
        p.id = `text-${data.id}`
        p.innerText = `Ticker: ${data.ticker}
                       Company: ${data.company}
                       Current Price: ${data.current_price}
                       Shares: ${data.shares}
                       Market Value: ${data.market_value}` 
        p.style.color = "white"
        div.appendChild(d)
        div.appendChild(p)
        
    
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
        
            // Change type to "doughnut", "line", "splineArea", etc.
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
// update chart after specified time. 

};
setInterval(function(){updateChart()}, 1000); 


}












function searchBar(){       
    const div = document.getElementById('search-form-container')
   

    const searchForm = document.createElement('form')
    const input = document.createElement('input')
    const submit = document.createElement('input')
    input.setAttribute("type", "text")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Search")
    searchForm.id = "search-form"
    input.id = 'searchitem'
    submit.id = "search-button"


    
   
    searchForm.appendChild(input)
    searchForm.appendChild(submit)
    div.appendChild(searchForm)




const searchItem = document.getElementById('searchitem')

searchItem.addEventListener('click', function(event){


const searchContainer = document.getElementById('searchContainer')
searchContainer.innerHTML = ""

})

const searchButton = document.getElementById('search-button')
searchButton.addEventListener('click', function(event){
    const searchBar = document.getElementById('searchitem').value
    event.preventDefault()
    
    fetch(`http://localhost:3000/stocklistings`)
    .then(response => response.json())
    .then(function(data){
        const a = data.find(e => e.ticker === searchBar||e.company === searchBar)
        showStock(a)
        buyStock(a)
    })
    
})
    
}






function getUser(){
}





