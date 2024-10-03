document.addEventListener("DOMContentLoaded", function () {
    getCurrentUser();
    getAllUsers();
    getRoles();
    setupCloseButtons();
});


function getCurrentUser() {
    fetch("/admin/currentUser")
        .then(response => response.json())
        .then(user => {
            let roles = user.authorities.map(aut => aut.name).join(', ');
            document.getElementById("navbarEmail").textContent = user.username;
            document.getElementById("navbarRoles").textContent = roles;
        })
}

function getAllUsers() {
    const tbody = document.getElementById("data-tbody");
    tbody.innerHTML = '';
    fetch("/admin/users")
        .then(response => response.json())
        .then(users => users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${user.authorities.map(role => role.name).join(', ')}</td>
            <td><button class="btn btn-info" onclick="openEditUserPopup(${user.id})">Edit</button></td>
            <td><button class="btn btn-danger" onclick="openDeleteUserPopup(${user.id})">Delete</button></td>
`
            tbody.appendChild(row);
        }));
}

function getRoles() {
    const roleSelect = document.getElementById('roles');
    const editRoleSelect = document.getElementById('editRoles');
    const deleteRoleSelect = document.getElementById('deleteRoles');
    fetch('/admin/roles')
        .then(response => response.json())
        .then(roles => {
            console.log('Роли загружены:', roles);
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.text = role.authority;
                roleSelect.appendChild(option);
                const editOption = document.createElement('option');
                editOption.value = role.id;
                editOption.text = role.authority;
                editRoleSelect.appendChild(editOption);
                const deleteOption = document.createElement('option');
                deleteOption.value = role.id;
                deleteOption.text = role.authority;
                deleteRoleSelect.appendChild(deleteOption);
            });
        })
        .catch(error => console.error('Ошибка при загрузке ролей:', error));
}

document.getElementById('addUser').addEventListener('submit', function (event) {
    event.preventDefault();
    const rolesSelected = Array.from(document.getElementById('roles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        age: parseInt(document.getElementById("age").value),
        username: document.getElementById("email").value,
        password: document.getElementById("password").value,
        roles: rolesSelected
    };
    console.log(user.firstName);
    console.log('Creating user:', user);
    fetch('/admin/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

    })
        .then(response => {
            console.log(1, user);
            getAllUsers();
            document.getElementById('addUser').reset();
            switchTab('#allUserTable');
        })
        .catch(error => {
            console.error('Error creating user:', error);
            alert('Ошибка при создании пользователя: ' + error.message);
        });
});

// Функция для открытия модального окна редактирования пользователя и заполнения формы
function openEditUserPopup(userId) {
    console.log('Opening edit modal for user ID:', userId);
    fetch(`/admin/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        })
        .then(user => {
            console.log('User fetched for edit:', user);
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.username;
            document.getElementById('editPassword').value = user.password;
            const editRolesSelect = document.getElementById('editRoles');
            Array.from(editRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value, 10));
            });
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            alert('Ошибка при загрузке данных пользователя');
        });
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}


document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const userId = document.getElementById('editUserId').value;
    const rolesSelected = Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        id: userId, // ID пользователя обязательно
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        age: parseInt(document.getElementById('editAge').value, 10),
        username: document.getElementById('editEmail').value,
        password: document.getElementById('editPassword').value,
        roles: rolesSelected
    };
    console.log('Updating user:', user);
    fetch(`/admin/update/${userId}`, { // Исправлен путь
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                getAllUsers();
                const modal = bootstrap.Modal.getInstance(document.getElementById(`editModal`));
                modal.hide();
            } else {
                return response.json().then(data => {
                    console.error('Ошибка обновления:', data);
                    alert('Ошибка при обновлении пользователя: ' + data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('Ошибка при обновлении пользователя: ' + error.message);
        });
});


function openDeleteUserPopup(userId) {
    console.log('Opening edit modal for user ID:', userId);
    fetch(`/admin/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        })
        .then(user => {
            console.log('User fetched for delete:', user);
            document.getElementById('deleteUserId').value = user.id;
            document.getElementById('deleteFirstName').value = user.firstName;
            document.getElementById('deleteLastName').value = user.lastName;
            document.getElementById('deleteAge').value = user.age;
            document.getElementById('deleteEmail').value = user.username;
            document.getElementById('deletePassword').value = user.password;
            const deleteRolesSelect = document.getElementById('deleteRoles');
            Array.from(deleteRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value, 10));
            });
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}


document.getElementById('deleteUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const userId = document.getElementById('deleteUserId').value;
    const rolesSelected = Array.from(document.getElementById('deleteRoles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        id: userId, // ID пользователя обязательно
    };
    console.log('Deleting user:', user);
    fetch(`/admin/delete/${userId}`, { // Исправлен путь
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                getAllUsers();
                const modal = bootstrap.Modal.getInstance(document.getElementById(`deleteModal`));
                modal.hide();
            } else {
                return response.json().then(data => {
                    console.error('Ошибка обновления:', data);
                    alert('Ошибка при обновлении пользователя: ' + data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
        });
});


function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}


function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


function setupCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', function () {
        const modals = document.querySelectorAll('.popup');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

function switchTab(tabId) {
    document.querySelector('#newUser').classList.remove('active');
    document.querySelector(tabId).classList.add("active");
    document.querySelector('#newUser').setAttribute('aria-selected', 'false');
    document.querySelector(tabId).setAttribute('aria-selected', 'true');
    document.querySelector('#addNewUser').classList.remove('active' , 'show');
    document.querySelector('#usersTable').classList.add('active' , 'show');
}

