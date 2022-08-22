function addtocart(product)
{
    console.log("here",product);
    $.ajax({
        type:'get',
        url:"/AddCart",
        data: {
productId:product
          },
          dataType: "json",
          success: (response) => {

            window.location.href ='/AddCart';

          }
    })


}







function cartcontrol(UserObject, Quantity, productId, count) {
  console.log(UserObject, Quantity, productId, count);
  event.preventDefault();
  console.log(Number(Quantity) + Number(count));
  if (Number(Quantity) + Number(count) == 0) {
    alert("canot be done");
  } else {
    console.log(UserObject, Quantity, productId, count);
    $.ajax({
      type: "POST",
      url: "/CountControl",
      data: {
        UserObject: UserObject,
        Quantity: Quantity,
        productId: productId,
        count: count,
      },
      dataType: "json",
      success: (response) => {
        location.reload();
      },
    });
  }
}



function RemoveProduct(UserObject,productId)
{
    event.preventDefault()

    $.ajax({
        type:'post',
        url:"/RemoveProduct",
        data: {
UserObject:UserObject,
productId:productId

          },
          dataType: "json",
          success: (response) => {
            window.location.href ='/AddCart';
          }
    })
   
}