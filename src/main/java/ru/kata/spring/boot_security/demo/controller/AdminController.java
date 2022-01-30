package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @GetMapping()
    public String getAllUsers(ModelMap modelMap){
        modelMap.addAttribute("users",userService.allUsers());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        modelMap.addAttribute("usera",(User)auth.getPrincipal());
        return "admin";
    }
    @GetMapping("/add")
    public String addPage(@ModelAttribute("user") User user){
        return "adduser";
    }
    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult){
        if (bindingResult.hasErrors())
            return "adduser";

        userService.createUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/edit")
    public String editPage(@RequestParam(value = "id") long id, ModelMap modelMap){
        modelMap.addAttribute("user",userService.readUser(id));
        return "editpage";
    }
    @PostMapping("/edit")
    public String editUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult){
        if(bindingResult.hasErrors())
            return "editpage";
        userService.updateUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/delete")
    public String deleteUser(@RequestParam(value = "id") long id){
        userService.deleteUser(userService.readUser(id));
        return "redirect:/admin";
    }
}
