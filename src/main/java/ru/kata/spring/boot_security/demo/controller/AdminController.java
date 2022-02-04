package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.ExeptionHandler.DataInfoHandler;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){

        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<DataInfoHandler> addUser(@RequestBody @Valid User user, BindingResult bindingResult){
        userService.createUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DataInfoHandler> editUser(@PathVariable("id") long id, @RequestBody @Valid User user, BindingResult bindingResult){
        userService.updateUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") long id){

        userService.deleteUser(userService.readUser(id));
    }

    @GetMapping("/findOne/{id}")
    @ResponseBody
    public ResponseEntity<User> findOne(@PathVariable("id") long id){
        return new ResponseEntity<>(userService.readUser(id), HttpStatus.OK);
    }

    @GetMapping("/getuser")
    public ResponseEntity<User> getUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User)auth.getPrincipal();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
