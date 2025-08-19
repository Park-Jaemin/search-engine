package com.test.besearch.customer;

import com.test.besearch.customer.entity.Customer;
import com.test.besearch.search.SearchParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerQueryDsl {

    Page<Customer> findByPhoneEndsWith(SearchParam param, Pageable pageable);

}
