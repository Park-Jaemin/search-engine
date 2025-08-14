package com.test.besearch.search;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Page<Patient> findByPhoneEndsWith(String phone, Pageable pageable);

    Page<Patient> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Patient> findByNameContainingIgnoreCaseAndPhoneEndsWith(String name, String phone, Pageable pageable);

}
