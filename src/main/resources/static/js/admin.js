$(async function () {
    await getUser();
    getTableWithUsers();
    getTableWithUser();
    getDefaultModal();
    addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    userAutorization: async () => await fetch('admin/getuser'),
    findOneUser: async (id) => await fetch(`admin/findOne/${id}`),
    findAllUsers: async () => await fetch('admin/users'),
    updateUser: async (user, id) => await fetch(`admin/edit/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`admin/delete/${id}`, {method: 'DELETE', headers: userFetchService.head}),
    addNewUser: async (user) => await fetch('admin/add', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)})
}

async function getUser() {
    let title = $('#mail h4');
    title.empty();


    await userFetchService.userAutorization()
        .then(res => res.json())
        .then(user => {
            let rolesname;
            user.roles.forEach(function (item){
                rolesname += item.name + ' ';
            })
            let usernameFilling = $(`
                
                <h4>${user.username} <small>
                    with roles: ${rolesname.replace(/undefined/gi,'')}
                </small></h4>`
            );

            title.append(usernameFilling);
        })
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let rolesname;
                user.roles.forEach(function (item){
                    rolesname += item.name + ' ';
                })
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>  
                            <td>${rolesname.replace(/undefined/gi,'')}</td>     
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })
    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getTableWithUser() {
    let table = $('#mainTableWithUser tbody');
    table.empty();

    await userFetchService.userAutorization()
        .then(res => res.json())
        .then(user => {
            let rolesname;
            user.roles.forEach(function (item){
                rolesname += item.name + ' ';
            })
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${rolesname.replace(/undefined/gi,'')}</td>
                        </tr>
                )`;
            table.append(tableFilling);
        })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="container col-6 text-center">
                    <div class="form-group text-center">
                        <label for="id" class="form-control-label font-weight-bold">ID</label>
                        <input type="text" class="form-control" id="id" name="id" value="${user.id}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="name" class="form-control-label font-weight-bold">First Name</label>
                        <input class="form-control" type="text" id="name" value="${user.name}">
                    </div>
                    <div class="form-group text-center">
                        <label for="lastname" class="form-control-label font-weight-bold">Last Name</label>
                        <input class="form-control" type="text" id="lastname" value="${user.lastname}">
                    </div>
                    <div class="form-group text-center">
                        <label for="age" class="form-control-label font-weight-bold">Age</label>
                        <input class="form-control" id="age" type="number" value="${user.age}">
                    </div>
                    <div class="form-group text-center">
                        <label for="username" class="form-control-label font-weight-bold">Email</label>
                        <input class="form-control" id="username" type="email" value="${user.username}">
                    </div>
                    <div class="form-group text-center">
                        <label for="password" class="form-control-label font-weight-bold">Password</label>
                        <input class="form-control" type="password" id="password">
                    </div>
                    <div class="form-group text-center">
                        <label for="role" class="font-weight-bold">Role</label>
                        <select class="form-control" id="role">
                            <option value="USER" >USER</option>
                            <option value="ADMIN" >ADMIN</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let lastname = modal.find("#lastname").val().trim();
        let age = modal.find("#age").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let role = modal.find("#role").val().trim();
        let data = {
            id: id,
            name: name,
            lastname: lastname,
            age: age,
            username: username,
            password: password,
            role: role
        }
        const response = await userFetchService.updateUser(data, id);
            getTableWithUsers();
            modal.modal('hide');
    })
}

async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Delete user');

    let deleteCloseButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(deleteCloseButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="container col-6 text-center">
                    <div class="form-group text-center">
                        <label for="id" class="form-control-label font-weight-bold">ID</label>
                        <input type="text" class="form-control" id="id" name="id" value="${user.id}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="name" class="form-control-label font-weight-bold">First Name</label>
                        <input class="form-control" type="text" id="name" value="${user.name}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="lastname" class="form-control-label font-weight-bold">Last Name</label>
                        <input class="form-control" type="text" id="lastname" value="${user.lastname}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="age" class="form-control-label font-weight-bold">Age</label>
                        <input class="form-control" id="age" type="number" value="${user.age}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="username" class="form-control-label font-weight-bold">Email</label>
                        <input class="form-control" id="username" type="email" value="${user.username}" readonly>
                    </div>
                    <div class="form-group text-center">
                        <label for="role" class="font-weight-bold">Role</label>
                        <select multiple name="role" class="form-control" id="role" readonly>
                            <option value="USER" >USER</option>
                            <option value="ADMIN" >ADMIN</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        getTableWithUsers();
        modal.modal('hide');
    })
}

async function addNewUser() {
    let addUserForm = $('#userForm div');
    addUserForm.empty();

    let addButton = `<button  class="btn btn-success" id="addButton">Add new user</button>`;

    let userForm = `
            <form class="form-group" id="addUser">
                <div class="container col-10 text-center">
                    <div class="form-group text-center">
                        <label for="name" class="form-control-label font-weight-bold">First Name</label>
                        <input class="form-control" type="text" id="name" >
                    </div>
                    <div class="form-group text-center">
                        <label for="lastname" class="form-control-label font-weight-bold">Last Name</label>
                        <input class="form-control" type="text" id="lastname" >
                    </div>
                    <div class="form-group text-center">
                        <label for="age" class="form-control-label font-weight-bold">Age</label>
                        <input class="form-control" id="age" type="number">
                    </div>
                    <div class="form-group text-center">
                        <label for="username" class="form-control-label font-weight-bold">Email</label>
                        <input class="form-control" id="username" type="email" >
                    </div>
                    <div class="form-group text-center">
                        <label for="password" class="form-control-label font-weight-bold">Password</label>
                        <input class="form-control" type="password" id="password">
                    </div>
                    <div class="form-group text-center">
                        <label for="role" class="font-weight-bold">Role</label>
                        <select name="role" class="form-control" id="role">
                            <option value="USER" >USER</option>
                            <option value="ADMIN" >ADMIN</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
    addUserForm.append(userForm);
    addUserForm.append(addButton);

    $("#addButton").on('click', async () => {
        let name = addUserForm.find("#name").val().trim();
        let lastname = addUserForm.find("#lastname").val().trim();
        let age = addUserForm.find("#age").val().trim();
        let username = addUserForm.find("#username").val().trim();
        let password = addUserForm.find("#password").val().trim();
        let role = addUserForm.find("#role").val().trim();
        let data = {
            name: name,
            lastname: lastname,
            age: age,
            username: username,
            password: password,
            role: role
        }
        const response = await userFetchService.addNewUser(data);
        getTableWithUsers();
        $(`#tabs-936887 a:first`).tab('show');
        addUserForm.find("#name").val('');
        addUserForm.find("#lastname").val('');
        addUserForm.find("#age").val('');
        addUserForm.find("#username").val('');
        addUserForm.find("#password").val('');
    })
}