function createNewElement() {
    // First create a DIV element.
  
    var txtNewInputBox = document.createElement('div');

    // Then add the content (a new input box) of the element.
    txtNewInputBox.innerHTML = "<div id='row'  class='row m-t-10 form-group'><input placeholder='subCategory' name='SubCategory' class='col-lg-10 form-control' type='text' id='first_item' class='form-control' ><button id='removeRow' type='button' class='btn btn-danger'>Remove</button></div>";
 
    // Finally put it where it is supposed to appear.
    document.getElementById("newElementId").appendChild(txtNewInputBox);
    
}


function callSubCategory()
{
    const maincata=document.getElementById("MainCategory").value
    // console.log(maincata);
  $.ajax({
    url:"/admin/getsubCategory",
    data:{maincata:maincata},
    method: "post",
    success: (response) => {

        $("#subCatagory option[id='subcategoryselect']").remove();

        console.log(response);
        
        let select = document.querySelector("#subCatagory");
        var opt = document.createElement("option");
        opt.id="subcategoryselect"
        opt.innerHTML ="select";
        opt.disabled="disabled"
        opt.selected="selected"
        select.appendChild(opt);
        for (let i = 0; i < response.length; i++) {
        
            var opt = document.createElement("option");
          opt.value = response[i].SubCategory;
        
          opt.id="subcategoryselect"
          opt.innerHTML = response[i].SubCategory;
          select.appendChild(opt);
        }

      
    }
  }) 

}


function readURL(input){
if (input.files && input.files[0]){
var reader = new FileReader();
reader.onload = function(e){
$("#imgPreview").attr('src',e.target.result).width(100).hight(100)
}
reader.readAsDataURL(input.files[0])
}
}
$("#img").change(function(){
    readURL(this);
})