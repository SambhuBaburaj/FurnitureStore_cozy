
function OrderStatus(userid)

{
    const currentstatus=document.getElementById('statussss').value
    console.log(currentstatus);

    swal({
        title: "Are you sure?",
        text: "youwant to change status to "+currentstatus,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {

            $.ajax({
                type:'post',
                url:"/admin/orderModify",
                data: {
        userid:userid,
        status:currentstatus
                  },
                  dataType: "json",
                  success: (response) => {
                  
                    window.location.reload()
                
                      
                  }
            })


        
        } else {
          swal("Your imaginary file is safe!");
          window.location.reload()
        }
      });

}