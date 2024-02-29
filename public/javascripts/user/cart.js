async function removecart(a,d){
    let removedcart=document.querySelectorAll('.removedcart')
    let b=await fetch(`http://localhost:4000/user/cart/removecart/${a}`)
    b=await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product is not in your Cart','warning')
        }else{
            removedcart[d].remove()
            appendAlert('Product removed from Cart','success')
        }
    }else{
        appendAlert('Error in removing from Cart','danger')
    }    
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}