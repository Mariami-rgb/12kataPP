package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.entity.User;

import java.util.List;

public interface UserService {
    public User findByUsername(String username);
    public List<User> getAllUsers();
    public void saveUser(User user);
    public User getUser(long id);
    public void deleteUser(long id);
}
