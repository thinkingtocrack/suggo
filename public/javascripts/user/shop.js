function filter(){
    let filtercheck=document.querySelectorAll('.filtercat')
    let input=document.querySelector('#hiddeninputx')
    let b=[]
    filtercheck.forEach((a)=>{
        if(a.checked){
            b.push(a.name)
        }
    })
    input.value=b
    return true
}

