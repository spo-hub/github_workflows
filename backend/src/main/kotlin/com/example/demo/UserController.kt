package com.example.demo

import org.springframework.web.bind.annotation.*
import kotlinx.coroutines.flow.Flow

@RestController
@RequestMapping("/api/users")
class UserController(private val userRepository: UserRepository) {

    @GetMapping
    suspend fun getAllUsers(): Flow<User> {
        return userRepository.findAll()
    }

    @GetMapping("/by-email")
    suspend fun getUserByEmail(@RequestParam email: String): User? {
        return userRepository.findByEmail(email)
    }

    @DeleteMapping("{id}")
    suspend fun deleteUserById(@PathVariable id: Long): Unit {
        userRepository.deleteById(id)
    }
}