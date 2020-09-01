document.addEventListener('DOMContentLoaded', (event) => {
        login();
        // getUser();
        // getStocks();
    })
   



    function hideForm(){
        const loginForm = document.getElementById('login-form')
        loginForm.style.display = 'none';
    }


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
            const body = document.querySelector('body')
            const h1 = document.createElement('h1')
            h1.innerText = `Welcome, ${user.username}`
            body.append(h1)
        })
        
    

    
    
    })
    

    
}



function searchBar(){
    
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


// function chart(stocks){
//    for(let i =0; i <stocks.length;i++) {
//         let chart = new CanvasJS.Chart("chartContainer", {
//             title:{
//                 text: "Stock Performance"              
//             },
//             data: [              
//             {
//                 // Change type to "doughnut", "line", "splineArea", etc.
//                 type: "line",
//                 dataPoints: [
//                     { label: "apple",  y: 10  },
//                     { label: "orange", y: 15  },
//                     { label: "banana", y: 25  },
//                     { label: "mango",  y: 30  },
//                     { label: "grape",  y: 28  }
//                 ]
//             }
//             ]
//         });
//         chart.render();
//    }
// }

function getStocks(){
    fetch('http://localhost:3000/stocks')
    .then(response => response.json())
    .then(data => stock(data))

    
    const main = document.querySelector('main')
    const div = document.getElementById('stockContainer')
   

    function stock(data) {
        let stocks = data.map(stock => {

            
       
            
            
            
            

            const d = document.createElement('div')
            d.id = `chartContainer${stock.id}`
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








// function createChart(){
//     main = document.querySelector('main')
//     let script = document.createElement('script')
//     script.src = "https://canvasjs.com/assets/script/canvasjs.min.js"
//     main.appendChild(script)

//     let datapoints = []
//     let chart = new CanvasJS.chart("chartContainer", {
//         title :{
//             text: "Stock Price"
//         },
//         data: [{
//             type: "line",
//             dataPoints: datapoints
//         }]
//     });


//     chartContainer = document.querySelector(".chartContainer")
   
   

    

//     function updateChart(count) {
//     let xValue = 0
//     let yValue = 100
//     let dataLength = 20



//     count = count || 1;

// 	for (var j = 0; j < count; j++) {
// 		yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
// 		dps.push({
// 			x: xVal,
// 			y: yVal
// 		});
// 		xVal++;
// 	}

// 	if (dps.length > dataLength) {
// 		dps.shift();
// 	}

// 	chart.render();
//     }

// updateChart(dataLength);

// setInterval(function(){updateChart()}, 1000);

// main.appendChild(chart)
// }


    
