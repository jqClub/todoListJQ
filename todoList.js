// 套路函数
// 定义一个 log 函数
var log = console.log.bind(console)

// 用自己实现的 e 替代 document.querySelector
var e = ele => {return document.querySelector(ele)}

var es = (elements) => {
    return document.querySelectorAll(elements)
}
var bindEvent = (element, event, callback) => {
    element.addEventListener(event, callback)
}
var bindEventAll = (elements, event, callback) => {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        element.addEventListener(event, callback)
    }
}
// 显示成指定格式的 时间 样式
var timeChange = () => {
    var d = new Date()
    var day=d.getDate()
    var month=d.getMonth() + 1
    var year=d.getFullYear()
    var timeg = year + "/" + month + "/" + day
    return timeg
}
// 用一个 todo 参数返回一个 todo cell 的 HTML 字符串
var templateTodo = function(todo) {
    var a = todo.task
    var b = ['', 'finished']
    var c = ['', 'active']
    var time = todo.createAt
    log('todo.finish', todo.finish)
    var t = `
        <div class="todoUl" data-index=${todo.finish}>
            <span class="todoState ${b[todo.finish]}" ></span>
            <span class="content todo-done ${c[todo.finish]}">${a}</span>
            <span class="timeAt">创建时间：${time}</span>
            <span class="btn del todo-delete">删除</span>
        </div>
    `
    log(t)
    return t
}

// 载入所有存储在 localStorage 里面的 todo
var loadTodos = function() {
    var s = localStorage.savedTodos
    // 第一次打开的时候, 还没有存储这个数据, s 是 undefined
    if (s == undefined) {
        return []
    } else {
        var ts = JSON.parse(s)
        return ts
    }
}

// log(typeof loadTodos())
// 把所有 todo 插入页面中
var insertTodos = function(todos) {
    log(todos)
    // 添加到 container 中
    var todoContainer = e('#id-div-container')
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        var html = templateTodo(todo)
        // 这个方法用来添加元素
        // 第一个参数 'beforeend' 意思是放在最后
        todoContainer.insertAdjacentHTML('beforeend', html)
    }
}

// 把 todo 参数添加并保存在 localStorage 中
var saveTodo = function(todo) {
    // 添加到 todos 数组
    var todos = loadTodos()
    todos.push(todo)
    var s = JSON.stringify(todos)
    localStorage.savedTodos = s
}
// 删除函数
var deleteTodo = function(container, todoCell) {
    // 1, 找到这个 todo 在 container 里面的下标
    for (var i = 0; i < container.children.length; i++) {
        var cell = container.children[i]
        if (todoCell == cell) {
            log('删除 cell, 找到下标', i)
            // 1, 删除这个 cell DOM
            todoCell.remove()
            // 2, 删除保存在 localStorage 里面的对应下标的数据
            var todos = loadTodos()
            // 删除数组中的指定下标的元素的方法如下(记住就好)
            // splice 函数可以删除数组的某个下标, 第一个参数是要删除的元素的下标
            // 第二个参数是要删除的个数, 我们只删一个, 所以这里是 1
            todos.splice(i, 1)
            // 删除后, 保存到 localStorage
            var s = JSON.stringify(todos)
            localStorage.savedTodos = s
        }
    }
}
// 更新函数
var updateTodo = function(container, todoCell, event) {
    var target = event.target
    // 1, 找到这个 todo 在 container 里面的下标
    for (var i = 0; i < container.children.length; i++) {
        var cell = container.children[i]
        if (todoCell == cell) {
            log('更新 cell, 找到下标', i)
            // 1, 更新这个 cell DOM
            target.classList.toggle('active')
            var todoDiv = target.parentElement
            var content = todoDiv.querySelector('.todoState')
            content.classList.toggle('finished')
            // 2, 更新保存在 localStorage 里面的对应下标的数据
            var todos = loadTodos()
            todos[i].finish = 1
            log('todos', todos)
            // 删除后, 保存到 localStorage
            var s = JSON.stringify(todos)
            localStorage.savedTodos = s
        }
    }
}

// 页面载入的时候, 把存储的 todos 数据插入到页面中
var todos = loadTodos()



// 添加的功能
var todoAdd = () => {
    // 给 add button 绑定添加 todo 事件
    var addButton = e('#id-button-add')
    addButton.addEventListener('click', function(){
        // 获得 input.value
        var todoInput = e('#id-input-todo')
        // 用 .value 属性获得用户输入的字符串
        var todo = todoInput.value
        // var myDate = new Date()
        var a = {
            task: todo,
            finish: 0,
            createAt: timeChange()
        }
        log('timeChange', timeChange())
        // 存储到 localStorage
        saveTodo(a)
        // 添加到 container 中
        var todoContainer = e('#id-div-container')
        var html = templateTodo(a)
        // 这个方法用来添加元素
        // 第一个参数 'beforeend' 意思是放在最后
        todoContainer.insertAdjacentHTML('beforeend', html)
    })
}


// 完成和删除的功能
var done = () => {
    var todoContainer = e('#id-div-container')

    todoContainer.addEventListener('click', function(event){
        log('container click', event, event.target)
        var target = event.target
        // 得到被点击的元素后, 通过查看它的 class 来判断它是哪个按钮
        if(target.classList.contains('todo-done')) {
            var todoDiv = target.parentElement
            var container = todoDiv.parentElement

            updateTodo(container, todoDiv, event)
        } else if (target.classList.contains('todo-delete')) {
            log('delete')
            var todoDiv = target.parentElement
            var container = todoDiv.parentElement
            deleteTodo(container, todoDiv)
        }
    })

}
// 主题设置
var showMenu = () => {
    var theme = e('.theme')
    bindEvent(theme, 'click', function() {
        var themeMenu = e('.theme-color')
        themeMenu.classList.toggle('show')
    })
}
// 鼠标移入上去的样式
var showLight = () => {
    // var theme = {
    //     theme-0,
    //     theme-1,
    //     theme-2,
    // }
    // var elements = es('.themeL')
    // var left = e('.todo-left')
    // var ind = left.dataset.ind
    // for (var i = 0; i < elements.length; i++) {
    //     var element = elements[i]
    //     element.addEventListener('click', function(event) {
    //         var target = event.target
    //         var index = target.dataset.index
    //         ind = index
    //
    //     })
    // }
    //
    var circle = es('.circle')
    var left = e('.todo-left')
    var ind = left.dataset.ind
    bindEventAll(circle, 'click', function(event) {
        var target = event.target
        log(target)
        // event.stopPropagation()
        // return false

        // target.classList.add('inTheme')

        var parent = target.closest('.todo-left')
        var index = target.dataset.index
        parent.classList.remove(`theme-${ind}`)
        parent.classList.add(`theme-${index}`)
        ind = index
    })
}

//***最后才调用,保证只有一个入口
var _main = function() {
    todoAdd()
    done()
    // 把本地 todos 显示在页面中
    insertTodos(todos)
    // 换肤
    showMenu()
    showLight()
}
_main()
