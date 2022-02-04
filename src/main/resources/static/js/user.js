$(async function () {
    await getTableWithUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findOneUser: async () => await fetch('/getuser')
}

async function getTableWithUser() {
    let table = $('#mainTableWithUser tbody');
    table.empty();

    let title = $('#mail h4');
    title.empty();


    await userFetchService.findOneUser()
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
            title.append(usernameFilling);
        })
}