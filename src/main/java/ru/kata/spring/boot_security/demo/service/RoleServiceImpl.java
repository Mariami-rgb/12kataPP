package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional
    @Override
    public List<Role> getRoles(List<Long> ids) {
        return roleRepository.findAllById(ids);
    }


}
