package com.example.demo

import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CoroutineCrudRepository<UserEntity, Long> {

    // Spring auto-generates the SQL!
    suspend fun findByEmail(email: String): UserEntity?
}
