package com.test.besearch.customer;

import com.test.besearch.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long>, CustomerQueryDsl {

}
