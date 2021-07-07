$("#gurudhakshinaForm").submit((e)=>{
    e.preventDefault();
    $.ajax({
        url:'/add-gurudhakshina',
        method: 'POST',
        data: $('#gurudhakshinaForm').serialize(),
        success:(response)=>{
            razorPay(response)
        }
    })
})

function razorPay(order){
    var options = {
        "key": "rzp_test_GSZGTR3AzGMHqc", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Rss Tvndr",
        "description": "Test Transaction",
        "image": "https://rsstvndrapp.herokuapp.com/images/omm.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            verifyPayment(response,order)
        },
        "prefill": {
            "name": order.name,
            "email": "youremail@gmail.com",
            "contact": ""
        },
        "notes": {
            "address": "ThiruvanvadoorP.O,Chengannur,Kerala"
        },
        "theme": {
            "color": "#f05000"
        }

    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment,order){
    $.ajax({
        url: '/verify-payment',
        method: 'POST',
        data:{
            payment,order
        },
        success:(response)=>{
            if(response.status){
                window.location.href = "/payment-success"
            }else{
                alert("ERROR OCCURED")
            }
        }
    })
}