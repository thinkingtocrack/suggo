function deleteProduct(a){
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'),{backdrop:'static'})
    myModal.show()
    document.getElementById('deleteProductBtn').addEventListener('click',(e)=>{
        e.stopPropagation();
        fetch(`http://localhost:4000/admin/product/deleteproduct/${a}`)
        .then((a)=>{
            return a.json()
        })
        .then((a)=>{
            if(a.deleted){
                location.reload()
            }else{
                alert('product not deleted')
            }
        })
    })
}


function productStatus(a,b){
    const statusModal=document.getElementById('statusModal')
    c=statusModal.getElementsByClassName('form-check-input')
    if(b){
        c[0].checked=true
    }else{
        c[1].checked=true
    }
    const myModal=new bootstrap.Modal(statusModal,{backdrop:'static'})
    myModal.show()
    document.getElementById('publishStatus').addEventListener('click',(e)=>{
        e.stopPropagation()
        if(c[0].checked==true){
            b=true
        }else{
            b=false
        }
        fetch('http://localhost:4000/admin/product/status',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                statusid:a,
                status:b,
            })
        })
        .then(a=>a.json())
        .then((a)=>{
            if(a.done){
                location.reload()
            }else{
                alert('product status not updated')
            }
        })
    })
}


function previewFiles() {
    const preview = document.querySelector("#selectedImage");
    const files = document.querySelector("#formFileMultiple").files;
    preview.innerHTML=''
    function readAndPreview(file) {
    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
        const image = new Image()
        image.height = 150;
        image.title = file.name;
        image.src = reader.result;
        preview.appendChild(image);
        },
        false,
    );

    reader.readAsDataURL(file);
}

if (files) {
Array.prototype.forEach.call(files, readAndPreview);
}
}

const picker = document.querySelector("#formFileMultiple");
picker.addEventListener("change", previewFiles);


async function productEdit(a){
    let b=await fetch(`http://localhost:4000/admin/product/edit/${a}`)
    b=await b.json()
    let editModal=document.querySelector('#editProduct')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
    document.querySelectorAll('.editproductbtnsub').forEach((a,i)=>{
         a.formAction=`/admin/product/edit/${i}/`+b.data._id
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        let k=document.getElementById(a.value)
        k.disabled=true
        if(a.value!='productfile'){
            let label=document.querySelector(`label[for=${a.value}]`)
            label.textContent=b.data[k.name]
        }
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        a.addEventListener('change',(e)=>{
            e.stopPropagation()
            let input=document.getElementById(`${a.value}`)
            input.disabled=!a.checked
        })
    })
}









function previewFiles2() {
    const preview = document.querySelector("#selectedImage2");
    const files = document.querySelector("#productfile").files;
    preview.innerHTML=''
    function readAndPreview(file) {
    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
        const image = new Image()
        image.height = 150;
        image.title = file.name;
        image.src = reader.result;
        preview.appendChild(image);
        },
        false,
    );

    reader.readAsDataURL(file);
}

if (files) {
Array.prototype.forEach.call(files, readAndPreview);
}
}

const picker2 = document.querySelector("#productfile");
picker2.addEventListener("change", previewFiles2);