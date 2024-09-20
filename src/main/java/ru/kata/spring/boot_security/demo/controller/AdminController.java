package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Collection;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService,RoleService roleService) {
        this.userService = userService;
        this.roleService=roleService;
    }

    @GetMapping("")
    public String getUsers(Model model, Principal principal){
        String username = principal.getName();
        User user = userService.findByUsername(username);
        model.addAttribute("user", user);
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("allRoles", roles);
        User newUser = new User();
        model.addAttribute("newUser", newUser);
        return "admin";
    }

    @PostMapping("/addUser")
    public String addUser(@ModelAttribute("newUser") User user, @RequestParam List<Long> roles, Model model) {
        List<Role> allRoles = roleService.getAllRoles();
        model.addAttribute("allRoles", allRoles);
        Collection<Role> userRoles = roleService.getRoles(roles);
        user.setRoles(userRoles);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable("id") long id, @ModelAttribute("user") @Valid User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}
