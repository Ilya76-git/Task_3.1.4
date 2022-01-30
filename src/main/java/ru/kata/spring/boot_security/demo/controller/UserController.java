package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class UserController {

    @GetMapping("/user")
    public String getUser(ModelMap map){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         map.addAttribute("user",(User)auth.getPrincipal());
        return "user";
    }
}
