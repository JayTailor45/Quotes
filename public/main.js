const update = document.querySelector('#update-btn')

let editId = '';

setEditFields = (id, name, quote) => {
    editId = id;
    document.getElementById('name').value = name;
    document.getElementById('quote').value = quote;
}

update.addEventListener('click', _ => {

    debugger

    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            _id: editId,
            name: document.getElementById('name').value,
            quote: document.getElementById('quote').value
          }),
    }).then(res => {
        if (res.ok) return res.json();
    }).then(data => {
        if(data.success) {
            window.location = '/';
        }
    });
})