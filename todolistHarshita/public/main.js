const retrieveButton = document.querySelector('#retrieve-button')
const updateButton = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')

retrieveButton.addEventListener('click',()=>{
    fetch('/getList')
    .then(response=>{
        if(response.ok)
            window.location.replace(response.url);
    })
    .catch(error=>{
        console.log(error);
    })
})

updateButton.addEventListener('click', () => {
    //hit the update end point
    updateList = document.getElementById('updateList')
    updateListTo = document.getElementById('updateListTo')
    const payload = {
        method: 'put',
        headers: {'content-type':'application/json'},
        body:JSON.stringify({updateList:updateList.value, updateListTo:updateListTo.value})
    }
    fetch('/updateList',payload)
    .then(result=>{
        if(result.ok) {
            alert('Required task updated!')
            return result.json()
        }
    })
    .then(response=>{
        window.location.reload();
    })
    .catch(error => console.log(error));
    
    updateList.value="";
    updateListTo.value="";

})

deleteButton.addEventListener("click", () => {
    //hit the delete end point
    deleteList = document.getElementById('deleteList').value
    const payload = {
        method: 'delete',
        headers: {'content-type':'application/json'},
        body:JSON.stringify({name:deleteList})
    }
    fetch('/deleteList',payload)
    .then(result=>{
        if(result.ok) {
            alert('Required task deleted!')
            return result.json()
        }
    })
    .then(response=>{
        if(response === 'delete op failed')
        console.log(response);
    })
    .catch(error => console.log(error));
    deleteList.value="";
});