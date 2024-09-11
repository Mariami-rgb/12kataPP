package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Collection;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(final UserService userService, final RoleService roleService) {
        this.userService = userService;
        this.roleService=roleService;
    }

    @GetMapping("")
    public String getUsers(Model model){
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "admin";
    }

    @GetMapping(value = "/new")
    public String addNewUser(@ModelAttribute("user") User user, Model model) {
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("allRoles", roles);
        return "add-user";
    }

    @PostMapping("/addUser")
    public String addUser(@ModelAttribute("user") User user, @RequestParam List<Long> roles) {
        Collection<Role> userRoles = roleService.getRoles(roles);
        System.out.println(userRoles);
        user.setRoles(userRoles);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit/{id}")
    public String editUser(Model model, @PathVariable("id") long id) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        Collection<Role> roles = roleService.getAllRoles();
        model.addAttribute("allRoles", roles);
        return "edit-user";
    }

    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable int id, @ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}
