package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Controller
public class AdminController {

    private final UserService userService;

    public AdminController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String getUsers(Model model){
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "admin";
    }

    @GetMapping(value = "/admin/new")
    public String newUser(@ModelAttribute("user") User user, Model model) {
        List<Role> roles = userService.getAllRoles();
        model.addAttribute("allRoles", roles);
        return "add-user";
    }

    @PostMapping("/admin/addUser")
    public String addUser(@ModelAttribute("user") User user, @RequestParam List<Long> roles, Model model) {
//        Collection<Role> userRoles = new HashSet<>();
//        for (String role : roles) {
//            Role roleObj = userService.getRole(Integer.parseInt(role));
//            userRoles.add(roleObj);
//        }
        Collection<Role> userRoles = userService.getRoles(roles);
        user.setRoles(userRoles);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit/{id}")
    public String editUser(Model model, @PathVariable("id") long id) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        return "edit-user";
    }

    @PostMapping("/admin/update/{id}")
    public String updateUser(@PathVariable int id, @ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/admin/delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}
