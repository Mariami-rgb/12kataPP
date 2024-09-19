package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import java.util.Collection;
import java.util.List;

public interface RoleService {
    public List<Role> getAllRoles();
    public Collection<Role> getRoles(Collection<Long> ids);
}
