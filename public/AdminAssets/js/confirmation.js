function deleteProduct(statusa, ida) {
  const values = ida;
  swal({
    title: "Are you sure?",
    text: "do you want to block this user",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {





    if (willDelete)
    {
      
      $.ajax(
        {
        url:  "/admin/DeActive/" + ida,
        data: {
          orderId:ida,
        },
        method: "get",
    
        success: (response) => {
          location.reload();
           }})



    // window.location.href = "/admin/DeActive/" + ida;
   
   
       }   else {
      swal("operation canceled");
    }
    // fetch(/admin/active, { method: 'GET', status: StatusId,id:UserId})
    //     .then((res) => {
    //         console.log("weoifw");
  });
}
