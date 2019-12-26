

let todo = [];
if(localStorage.getItem('todo') !=undefined){
    todo = JSON.parse(localStorage.getItem('todo'));
    todo.forEach(item => {
        if(item.list === 'todo'){
            document.querySelector('.to-do').append(createTaskItem(item.id, item.todo, item.date));
        } else if(item.list === 'in-progress'){
            document.querySelector('.in-progress').append(createTaskItem(item.id, item.todo, item.date));
        } else if (item.list === 'done'){
            document.querySelector('.done').append(createTaskItem(item.id, item.todo, item.date));
        }
        counter()
    })
}

document.getElementById('add').onclick = () =>{
    let taskObj = {};

    let taskText = document.querySelector('.input-text').value;
    let taskDate = document.querySelector('.input-data').value;

    let number = Math.round(Math.random() * 999);
    
    taskObj.id = number;
    taskObj.todo = taskText;
    taskObj.date = taskDate;
    taskObj.list = 'todo';

    let inputs = document.querySelectorAll('.input')
    let error = false;
    inputs.forEach(item => {
        if(item.value === ''){
            error = true;
            item.classList.add('input-error');
            item.onfocus = () => {
                item.classList.remove('input-error');
            }
        }else{
            item.classList.remove('input-error');
        }
    })
    if(!error){
        todo.push(taskObj);
        document.querySelector('.to-do').append(createTaskItem(taskObj.id, taskObj.todo, taskObj.date));
        counter();
        document.querySelector('.input-text').value = '';
        document.querySelector('.input-data').value = '';

        localStorage.setItem('todo', JSON.stringify(todo))
    }
}

// Создание эелемента li с таской 
function createTaskItem(id, text, date){
    
    let li = document.createElement('li');
    let textItem = document.createTextNode(text);
    let dateItem = document.createTextNode(date);

    let closeItem = document.createElement('button');
    closeItem.className = 'close-task';
    closeItem.addEventListener('click', deleteTask);
    closeItem.addEventListener('click', deleteTaskInObject);

    let uppItem = document.createElement('button');
    uppItem.className = 'upp-task';
    uppItem.addEventListener('click', updateTask);
    uppItem.addEventListener('click', updateTaskInObject);

    let buttonGroup = document.createElement('div');
    buttonGroup.append(closeItem, uppItem);
    buttonGroup.className = 'button-group';

    let dateSpan = document.createElement('span');
    dateSpan.append(dateItem);
    dateSpan.className = 'task-date';

    let textGroup = document.createElement('div');
    textGroup.append(dateSpan, textItem);

    li.setAttribute('id', id)

    li.append(textGroup, buttonGroup);
    li.className = 'task-item';

    return li;
}

// Обработчик переноса таски
function updateTask(event){
    if(event.target.closest('.to-do')){
        if(document.querySelector('.in-progress').childElementCount >= 5){
            document.querySelector('.section-modal').classList.add('active');
        }else{
            document.querySelector('.in-progress').append(event.target.closest('.task-item'));
            counter();
        }
    }
    else if(event.target.closest('.in-progress')){
        document.querySelector('.done').append(event.target.closest('.task-item'));
        counter()
    }
    else if(event.target.closest('.done')){
        document.querySelector('.to-do').append(event.target.closest('.task-item'));
        counter()
    }
}

// Обработчик удаления таски
function deleteTask(event){
    if(event.target.closest('.in-progress')){
        document.querySelector('.delete-progress-task').classList.add('active');
        document.querySelector('.delete-task-modal').onclick = () =>{
            document.querySelector('.delete-progress-task').classList.remove('active');
            event.target.closest('.task-item').remove();
            counter();

            // Для localStorage
            let id = event.target.closest('.task-item').getAttribute('id');
            todo.forEach(item =>{
                if(item.id == id){
                    item.list = '';
                }
            })
            localStorage.setItem('todo', JSON.stringify(todo))
        }
    }else{
        event.target.closest('.task-item').remove();
        counter();
    }
}

// Удаление всего списка
document.querySelectorAll('.delete-all').forEach(item =>{
    item.addEventListener('click', (event) => {
        if(event.target.closest('.card-box').querySelector('.in-progress')){
            //alert('sure?');
            document.querySelector('.delete-modal').classList.add('active');
        }
        else{
            event.target.closest('.card-box').querySelectorAll('.task-item').forEach(item =>{
                item.remove();
            })
        counter()
        }
    })
})


// Закрытие модалки не больше пяти задач в in progress
document.querySelector('.close-modal').onclick = () => {
    document.querySelector('.section-modal').classList.remove('active'); 
}

// Закрытие модалки delete list/task in progress 
document.querySelectorAll('.close-warning-modal').forEach(item =>{
    item.onclick = () => {
        document.querySelector('.delete-modal').classList.remove('active');
        document.querySelector('.delete-progress-task').classList.remove('active')
    }
})

// Подтверждение удаления всего списка в in-progress
document.querySelector('.delete-list-modal').onclick = () => {
    document.querySelector('.delete-modal').classList.remove('active');
    document.querySelector('.in-progress').querySelectorAll('.task-item').forEach(item =>{
        item.remove()
    })
    todo.forEach(item => {
        if(item.list === 'in-progress'){
            item.list = '';
        }
    })
    localStorage.setItem('todo', JSON.stringify(todo))
    counter()
}

// Счетчик элементов в списках задач
function counter(){
    document.querySelectorAll('.task-list').forEach(item =>{
        item.parentElement.parentElement.querySelector('.counter').innerHTML = item.childElementCount;
    })
}


// Обработчик обновления таски для localStorage
function updateTaskInObject(event){
    let id = event.target.closest('.task-item').getAttribute('id');
    if(event.target.closest('.to-do')){
        todo.forEach(item => {
        if(item.id == id){
            item.list = 'todo';
        }
        localStorage.setItem('todo', JSON.stringify(todo))
    })
    }else if(event.target.closest('.in-progress')){
        todo.forEach(item => {
        if(item.id == id){
            item.list = 'in-progress';
        }
        localStorage.setItem('todo', JSON.stringify(todo))
    })
    }else if(event.target.closest('.done')){
        todo.forEach(item => {
        if(item.id == id){
            item.list = 'done';
        }
        localStorage.setItem('todo', JSON.stringify(todo))
    })
    }
}


// Обработчик удаления таски для localStorage
function deleteTaskInObject(event){
    if(!event.target.closest('.in-progress')){
        let id = event.target.closest('.task-item').getAttribute('id');
        todo.forEach(item => {
        if(item.id == id){
            item.list = '';
        }
        localStorage.setItem('todo', JSON.stringify(todo))
    })
    }
}


// Очистка всего списка для localStorage
document.querySelectorAll('.delete-all').forEach(item =>{
    item.addEventListener('click', (event) => {
        if(event.target.closest('.card-box').querySelector('.to-do')){
            todo.forEach(item => {
                if(item.list === 'todo'){
                    item.list = '';
                }
            })
            localStorage.setItem('todo', JSON.stringify(todo))
        }
        else if(event.target.closest('.card-box').querySelector('.done')){
            todo.forEach(item => {
                if(item.list === 'done'){
                    item.list = '';
                }
            })
            localStorage.setItem('todo', JSON.stringify(todo))
        }
    })
})








