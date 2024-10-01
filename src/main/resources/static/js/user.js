document.addEventListener("DOMContentLoaded", function () {
    fetch("/user/currentUser")
        .then(response => response.json())
        .then(user => {
            document.getElementById("userId").textContent = user.id;
            document.getElementById("firstName").textContent = user.firstName;
            document.getElementById("lastName").textContent = user.lastName;
            document.getElementById("age").textContent = user.age;
            document.getElementById("email").textContent = user.username;
            let roles = user.authorities.map(aut => aut.name).join(', ');
            document.getElementById("roles").textContent = roles;
            document.getElementById("navbarEmail").textContent = user.username;
            document.getElementById("navbarRoles").textContent = roles;
        })
        .catch(error => console.error("Error fetching user data:", error));
});