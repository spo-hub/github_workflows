package com.example.demo

import org.springframework.web.bind.annotation.*
import kotlinx.coroutines.flow.Flow

@RestController
@RequestMapping("/users")
class UserController(private val userRepository: UserRepository) {

    @GetMapping
    suspend fun getAllUsers(): Flow<User> {
        return userRepository.findAll()
    }
}