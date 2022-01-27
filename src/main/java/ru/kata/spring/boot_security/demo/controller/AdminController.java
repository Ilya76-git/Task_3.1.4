package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class AdminController {
    @Autowired
    private UserService userService;

    @GetMapping("/admin")
    public String getAllUsers(ModelMap modelMap){
        modelMap.addAttribute("users",userService.allUsers());
        return "admin";
    }
    @GetMapping("/admin/add")
    public String addPage(User user){
        return "adduser";
    }
    @PostMapping("/admin/add")
    public String addUser(User user){
        userService.createUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/admin/edit")
    public String editPage(@RequestParam(value = "id") long id, ModelMap modelMap){
        modelMap.addAttribute("user",userService.readUser(id));
        return "editpage";
    }
    @PostMapping("/admin/edit")
    public String editUser(@ModelAttribute("user") User user){
        userService.updateUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/admin/delete")
    public String deleteUser(@RequestParam(value = "id") long id){
        userService.deleteUser(userService.readUser(id));
        return "redirect:/admin";
    }
}
