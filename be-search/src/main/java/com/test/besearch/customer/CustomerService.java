package com.test.besearch.customer;

import com.test.besearch.customer.entity.Customer;
import com.test.besearch.search.SearchParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Page<Customer> searchDb(SearchParam param, Pageable pageable) {
        return customerRepository.findByPhoneEndsWith(param, pageable);
    }

}
