package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
    List<User> allUsers();

    void createUser(User user);

    User readUser(Long id);

    void deleteUser(User user);

    void updateUser(User user);
}
