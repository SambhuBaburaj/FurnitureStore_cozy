

function createNewElement() {
  // First create a DIV element.

  var txtNewInputBox = document.createElement("div");

  // Then add the content (a new input box) of the element.
  txtNewInputBox.innerHTML =
    "<div id='row'  class='row m-t-10 form-group'><input placeholder='subCategory' name='SubCategory' class='col-lg-10 form-control' type='text' id='first_item' class='form-control' ><button id='removeRow' type='button' class='btn btn-danger'>Remove</button></div>";

  // Finally put it where it is supposed to appear.
  document.getElementById("newElementId").appendChild(txtNewInputBox);
}

function callSubCategory() {
  const maincata = document.getElementById("MainCategory").value;
  // console.log(maincata);
  $.ajax({
    url: "/admin/getsubCategory",
    data: { maincata: maincata },
    method: "post",
    success: (response) => {
      $("#subCatagory option[id='subcategoryselect']").remove();

      console.log(response);

      let select = document.querySelector("#subCatagory");
      var opt = document.createElement("option");
      opt.id = "subcategoryselect";
      opt.innerHTML = "select";
      opt.disabled = "disabled";
      opt.selected = "selected";
      select.appendChild(opt);
      for (let i = 0; i < response.length; i++) {
        var opt = document.createElement("option");
        opt.value = response[i].SubCategory;

        opt.id = "subcategoryselect";
        opt.innerHTML = response[i].SubCategory;
        select.appendChild(opt);
      }
    },
  });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#imgPreview").attr("src", e.target.result).width(100).hight(100);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$("#img").change(function () {
  readURL(this);
});

function updatecat(catid) {
  event.preventDefault();
  const newcat = document.getElementById("mainCatagory").value;
  console.log(catid, newcat);
  swal({
    title: "Are you sure?",
    text: "you  wsnt to vhange to " + newcat,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/updateCategory",
        data: {
          newcat: newcat,
          catid: catid,
        },
        dataType: "json",
        success: (response) => {
          swal("category changed");
        },
      });
    } else {
      swal("canceled");
    }
  });
}


function subCatachangeInput(subcat,catid)
{
  event.preventDefault()
  const newsubcat=document.getElementById(subcat).value



  swal({
    title: "Are you sure?",
    text: "you  wsnt to change to " + newsubcat,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/updatesubCategory",
        data: {
          subcat:subcat,
          newsubcat:newsubcat,
          catid:catid
        },
        dataType: "json",
        success: (response) => {

          $('#'+subcat).val(newsubcat);
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })

   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });
}



function subCatachangedelete(subcat,catid)
{
  event.preventDefault()
  const newsubcat=document.getElementById(subcat).value



  swal({
    title: "Are you sure?",
    text: "you  wsnt to change to " + newsubcat,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/deletesubcat",
        data: {
          subcat:subcat,
          newsubcat:newsubcat,
          catid:catid
        },
        dataType: "json",
        success: (response) => {

          $('#'+subcat).val(newsubcat);
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })

   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });
}



function deletecategory(catid)
{
 event.preventDefault()

console.log('hi');

 swal({
  title: "Are you sure?",
  text: "you  wsnt to delete this category " ,
  icon: "warning",
  buttons: true,
  dangerMode: true,
}).then((willDelete) => {
  if (willDelete) {
    $.ajax({
      type: "POST",
      url: "/admin/deleteCategory",
      data: {
       
        catid:catid
      },
      dataType: "json",
      success: (response) => {

   
        swal("subcategory changed").then (()=>
        {
          location.reload()
        })

 
        // setTimeout(location.reload(), 5000);
      },
    });
  } else {
    swal("canceled");
  }
});



}


function deleteproductimage(image,id)
{

  event.preventDefault()
  console.log(image);
  swal({
    title: "Are you sure?",
    text: "you  wsnt to delete this this image " ,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/deleteimage",
        data: {
         
        image:image,
        id:id
        },
        dataType: "json",
        success: (response) => {
  
     
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })
  
   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });
  
  
}


function deleteproduct(prductid)
{
  event.preventDefault()

  swal({
    title: "Are you sure?",
    text: "you  wsnt to delete this this product " ,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/deleteproduct",
        data: {
         
      productid:prductid
        },
        dataType: "json",
        success: (response) => {
  
     
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })
  
   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });
  


}
function deletebanner(bannerId)
{


  event.preventDefault()

  swal({
    title: "Are you sure?",
    text: "you  wsnt to delete this this Banner " ,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/deleteBanner",
        data: {
         
      bannerId:bannerId
        },
        dataType: "json",
        success: (response) => {
  
     
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })
  
   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });

}

function deletebannerimage(bannerId)
{



  event.preventDefault()

  swal({
    title: "Are you sure?",
    text: "you  wsnt to delete this this Banner image" ,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: "POST",
        url: "/admin/deleteBannerimage",
        data: {
         
      bannerId:bannerId
        },
        dataType: "json",
        success: (response) => {
  
     
          swal("subcategory changed").then (()=>
          {
            location.reload()
          })
  
   
          // setTimeout(location.reload(), 5000);
        },
      });
    } else {
      swal("canceled");
    }
  });



}