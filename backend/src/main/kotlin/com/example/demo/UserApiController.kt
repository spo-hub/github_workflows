package com.example.demo

import com.example.demo.api.UsersApi
import com.example.demo.model.User
import com.example.demo.model.CreateUserRequest
import com.example.demo.model.UpdateUserRequest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api") // Base path for generated interface
class UserApiController(
    private val userRepository: UserRepository,
) : UsersApi {

    override fun getUsers(): ResponseEntity<Flow<User>> {
        val users = userRepository.findAll().map { UserMapper.toDto(it) }
        return ResponseEntity.ok(users)
    }

    override suspend fun createUser(createUserRequest: CreateUserRequest): ResponseEntity<User> {
        val entity = UserMapper.toEntity(createUserRequest)
        val saved = userRepository.save(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDto(saved))
    }

    override suspend fun deleteUser(id: Int): ResponseEntity<Unit> {
        userRepository.deleteById(id.toLong())
        return ResponseEntity.noContent().build()
    }

    override suspend fun updateUser(id: Int, updateUserRequest: UpdateUserRequest): ResponseEntity<User> {
        val existingUser = userRepository.findById(id.toLong())
            ?: return ResponseEntity.notFound().build()

        val updatedUser = UserMapper.updateEntity(existingUser, updateUserRequest)
        val saved = userRepository.save(updatedUser)
        return ResponseEntity.ok(UserMapper.toDto(saved))
    }

    @GetMapping("/users/by-email")
    suspend fun getUserByEmail(@RequestParam email: String): ResponseEntity<User> {
        val entity = userRepository.findByEmail(email)
        return if (entity != null) {
            ResponseEntity.ok(UserMapper.toDto(entity))
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
